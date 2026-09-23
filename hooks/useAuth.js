"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginRequest } from "@/services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On first load, restore the logged-in user from localStorage so a
  // page refresh doesn't lose the session (the token itself lives in
  // both localStorage, for Axios, and a cookie, for the middleware).
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // Corrupted value - ignore and treat as logged out.
      }
    }
    setLoading(false);
  }, []);

  async function login(credentials) {
    const data = await loginRequest(credentials);
    const { accessToken, ...userInfo } = data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userInfo));
    // Non-httpOnly cookie, readable by the Next.js middleware so it can
    // protect /products/* routes on the server before the page renders.
    document.cookie = `token=${accessToken}; path=/; max-age=86400; samesite=lax`;

    setUser(userInfo);
    return userInfo;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
