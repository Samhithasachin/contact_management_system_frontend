import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const client = axios.create({
  baseURL: BASE_URL,
});

const TOKEN_KEY = "loqo:token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

// Builds a FormData payload for endpoints that accept an optional file
// (multer only parses multipart bodies -- plain JSON still works when
// there's no file, since express.json() has already parsed req.body by
// the time multer's middleware runs and sees a non-multipart request).
export function toFormData(fields, fileField, file) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    fd.append(key, typeof value === "object" ? JSON.stringify(value) : value);
  }
  if (file) fd.append(fileField, file);
  return fd;
}
