const CSRF_STORAGE_KEY = "linkedin_oauth_csrf";

function toBase64Url(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  return atob(padded + "===".slice((padded.length + 3) % 4));
}

export function startLinkedInLogin() {
  const csrf = crypto.randomUUID();
  sessionStorage.setItem(CSRF_STORAGE_KEY, csrf);

  const state = toBase64Url(JSON.stringify({ csrf, client: "web" }));
  const params = new URLSearchParams({
    response_type: "code",
    client_id: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_LINKEDIN_REDIRECT_URI,
    scope: "openid profile email",
    state,
  });
  window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

export function consumeLinkedInState(state) {
  const expected = sessionStorage.getItem(CSRF_STORAGE_KEY);
  sessionStorage.removeItem(CSRF_STORAGE_KEY);
  if (!state || !expected) return false;
  try {
    const decoded = JSON.parse(fromBase64Url(state));
    return decoded.csrf === expected;
  } catch {
    return false;
  }
}
