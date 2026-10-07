import { client } from "./client";

// Provider-agnostic pending-contacts review, shared by every sync source
// (Google, Microsoft, ...) -- see routes/pendingContactsRoutes.js.
export async function getPendingContacts() {
  const { data } = await client.get("/contactSync/pending");
  return data;
}

export async function uploadPendingContacts(contactIds) {
  const { data } = await client.post("/contactSync/pending/upload", { contactIds });
  return data;
}

export async function discardPendingContacts(contactIds) {
  const { data } = await client.post("/contactSync/pending/discard", { contactIds });
  return data;
}
