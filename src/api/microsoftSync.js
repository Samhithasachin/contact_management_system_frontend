import { client } from "./client";

export async function getMicrosoftSyncStatus() {
  const { data } = await client.get("/microsoftSync/status");
  return data;
}

export async function disableMicrosoftSync() {
  const { data } = await client.post("/microsoftSync/disable");
  return data;
}
