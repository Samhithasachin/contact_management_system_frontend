import { getToken } from "../api/client";

function toBase64Url(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Mirrors src/utils/googleSyncOAuth.js exactly, for Microsoft Graph instead
// of Google. Only flow Microsoft has (no separate one-off "Select" like
// Google's implicit-token flow) -- connecting also runs an immediate first
// sync server-side (routes/microsoftSyncRoutes.js's /callback).
export function startMicrosoftSyncConnect() {
  const state = toBase64Url(JSON.stringify({ token: getToken() }));
  const params = new URLSearchParams({
    response_type: "code",
    client_id: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_MICROSOFT_SYNC_REDIRECT_URI,
    scope: "offline_access Contacts.Read",
    state,
  });
  window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
}
