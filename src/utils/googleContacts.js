const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CONTACTS_SCOPE = "https://www.googleapis.com/auth/contacts.readonly";
const MAX_CONTACTS = 1000;

// Must be called directly from a click handler -- Google requires a user
// gesture to show the consent popup for a non-basic scope like this one.
export function requestContactsAccessToken() {
  return new Promise((resolve, reject) => {
    if (!CLIENT_ID || !window.google?.accounts?.oauth2) {
      reject(new Error("Google Identity Services is not available."));
      return;
    }
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: CONTACTS_SCOPE,
      callback: (response) => {
        if (response?.access_token) resolve(response.access_token);
        else reject(new Error(response?.error || "Google did not grant contacts access."));
      },
      error_callback: (err) => reject(new Error(err?.message || "Google sign-in was cancelled.")),
    });
    client.requestAccessToken();
  });
}

export async function fetchGoogleContacts(accessToken) {
  const connections = [];
  let pageToken;

  do {
    const params = new URLSearchParams({
      personFields: "names,emailAddresses,phoneNumbers,organizations",
      pageSize: "200",
    });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(`https://people.googleapis.com/v1/people/me/connections?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const detail = body?.error?.message || res.statusText;
      throw new Error(`Couldn't fetch your Google contacts (${res.status}): ${detail}`);
    }
    const data = await res.json();

    connections.push(...(data.connections || []));
    pageToken = data.nextPageToken;
  } while (pageToken && connections.length < MAX_CONTACTS);

  return connections;
}

function pickByType(entries, type) {
  if (!entries?.length) return "";
  return (entries.find((e) => e.type === type) || entries[0]).value || "";
}

function pickOther(entries, usedValue) {
  if (!entries?.length) return "";
  const other = entries.find((e) => e.value !== usedValue);
  return other ? other.value : entries[0].value || "";
}

export function mapGoogleContact(person) {
  const name = person.names?.[0];
  const fname = name?.givenName?.trim();
  const lname = name?.familyName?.trim();
  if (!fname && !lname) return null;

  const org = person.organizations?.[0];
  const emails = person.emailAddresses;
  const phones = person.phoneNumbers;

  const workEmail = pickByType(emails, "work");
  const personalEmail = pickOther(emails, workEmail) || workEmail;
  const workPhone = pickByType(phones, "work");
  const personalPhone = pickOther(phones, workPhone) || workPhone;

  // Most personal Google contacts have no organization on file at all, but
  // the backend requires a company on every uploaded contact -- fall back to
  // the contact's email domain (still meaningful, e.g. "gmail.com"), or a
  // generic placeholder if there's no email to work with either, rather than
  // dropping these contacts from the import entirely.
  const email = workEmail || personalEmail;
  const emailDomain = email?.split("@")[1];
  const company = org?.name?.trim() || emailDomain || "Personal Contact";

  return {
    fname: fname || "",
    lname: lname || "",
    workInfo: {
      company,
      designation: org?.title?.trim() || "",
      email: workEmail,
      phone: workPhone,
    },
    personalInfo: {
      email: personalEmail,
      phone: personalPhone,
    },
  };
}
