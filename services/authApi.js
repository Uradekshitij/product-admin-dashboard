import { api } from "./api";

// All auth-related HTTP calls live here. UI components import these
// functions instead of calling axios directly.

export async function login({ username, password }) {
  const response = await api.post("/auth/login", {
    username,
    password,
    // expiresInMins is optional on DummyJSON; left out so it uses the default.
  });
  return response.data; // { id, username, ..., accessToken, refreshToken }
}

export async function fetchCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}
