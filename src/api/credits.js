import { client } from "./client";

export async function getCreditLedger() {
  const { data } = await client.get("/contacts/getCredits");
  return data;
}

export async function getCreditTotal() {
  const { data } = await client.get("/contacts/total");
  return data;
}
