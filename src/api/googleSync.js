import { client } from "./client";

export async function getGoogleSyncStatus() {
  const { data } = await client.get("/googleSync/status");
  return data;
}

export async function disableGoogleSync() {
  const { data } = await client.post("/googleSync/disable");
  return data;
}

export async function stagePendingContacts(contacts) {
  const { data } = await client.post("/googleSync/pending/stage", { contacts });
  return data;
}
