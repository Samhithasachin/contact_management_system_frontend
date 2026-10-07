import { client } from "./client";

export async function uploadContacts(contacts, creditPayload) {
  const { data } = await client.post("/contacts/upload", {
    contacts,
    totalContactsUploaded: contacts.length,
    creditPayload,
  });
  return data;
}

export async function getLoadedContacts() {
  const { data } = await client.get("/contacts/loadedContacts");
  return data;
}

export async function purchaseContact(contact) {
  const { data } = await client.post("/contacts/purchase", contact);
  return data;
}

export async function getPurchasedContacts() {
  const { data } = await client.get("/contacts/purchased");
  return data;
}

export async function getLinkedContacts() {
  const { data } = await client.get("/contacts/linkedByEmail");
  return data;
}
