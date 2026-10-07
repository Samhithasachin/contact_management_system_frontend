import { getToken } from "../api/client";

function toBase64Url(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Full-page redirect for the offline-access Authorization Code flow --
// distinct from the sign-in ID-token flow and the one-off implicit
// access-token flow (src/utils/googleContacts.js) already in place. This one
// gets a refresh token the backend can use on a schedule (routes/
// googleSyncRoutes.js), so it needs access_type=offline + prompt=consent.
//
// Since this attaches a permission to an ALREADY-logged-in CMS account (not
// a login itself), `state` carries this browser's own current session JWT
// so the backend callback knows which user to attach it to -- mirrors how
// src/utils/linkedinOAuth.js uses `state` as a tamper-proof payload channel.
export function startGoogleSyncConnect() {
  const state = toBase64Url(JSON.stringify({ token: getToken() }));
  const params = new URLSearchParams({
    response_type: "code",
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_GOOGLE_SYNC_REDIRECT_URI,
    scope: "https://www.googleapis.com/auth/contacts.readonly",
    access_type: "offline",
    prompt: "consent",
    state,
  });
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
