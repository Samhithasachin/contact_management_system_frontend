import { client } from "./client";

export async function searchCompanies(companyName) {
  if (!companyName?.trim()) return [];
  try {
    const { data } = await client.get("/companies/employees", { params: { companyName } });
    return data;
  } catch (err) {
    if (err.response?.status === 404) return [];
    throw err;
  }
}
