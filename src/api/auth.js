import { client, toFormData } from "./client";

export async function register({ fname, mname, lname, password, workInfo, personalInfo, profilePic }) {
  const fields = { fname, mname, lname, password, workInfo, personalInfo };
  const body = profilePic ? toFormData(fields, "profilePic", profilePic) : fields;
  const { data } = await client.post("/users/register", body);
  return data;
}

export async function login({ email, password }) {
  const { data } = await client.post("/users/login", { email, password });
  return data;
}

export async function loginWithGoogle(idToken) {
  const { data } = await client.post("/users/login/google", { idToken });
  return data;
}

export async function getUserDetails() {
  const { data } = await client.get("/users/userDetails");
  return data;
}

export async function changePassword({ currentPassword, newPassword }) {
  const { data } = await client.put("/users/changePassword", { currentPassword, newPassword });
  return data;
}

export async function updateUser({ fname, mname, lname, workInfo, personalInfo, profilePic }) {
  const fields = { fname, mname, lname, workInfo, personalInfo };
  const body = profilePic ? toFormData(fields, "profilePic", profilePic) : fields;
  const { data } = await client.put("/users/updateUser", body);
  return data;
}
