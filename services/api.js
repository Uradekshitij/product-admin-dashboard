import axios from "axios";

// The ONE shared Axios instance used by every API call in the app.
// - Sets the DummyJSON base URL once.
// - Attaches the auth token to every outgoing request automatically.
// - Normalizes errors in one place so components don't each write their
//   own error-parsing logic.

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://dummyjson.com";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// --- request interceptor: attach the token ---------------------------------
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- response interceptor: normalize errors ---------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A cancelled request (from AbortController) isn't a real error for the
    // UI to show - let callers detect it and ignore it silently.
    if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Token is missing/expired - clear local auth state so the next
      // protected navigation sends the user back to /login.
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.cookie = "token=; path=/; max-age=0";
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject({ ...error, friendlyMessage: message });
  }
);
