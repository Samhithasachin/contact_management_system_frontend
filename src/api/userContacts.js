import { client, toFormData } from "./client";

export async function syncContacts(contacts) {
  const { data } = await client.post("/userContacts/sync", { contacts });
  return data;
}

export async function listMyContacts() {
  const { data } = await client.get("/userContacts/list");
  return data;
}

export async function updateMyContact(userDocId, contactId, updates, profilePic) {
  const body = profilePic ? toFormData(updates, "profilePic", profilePic) : updates;
  const { data } = await client.put(`/userContacts/${userDocId}/contacts/${contactId}`, body);
  return data;
}
