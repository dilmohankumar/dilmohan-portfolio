import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ isAdmin: false, email: null, username: null, csrfToken: null });
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setAuth({
        isAdmin: !!data.isAdmin,
        email: data.email ?? null,
        username: data.username ?? null,
        csrfToken: data.csrfToken ?? null,
      });
    } catch {
      setAuth({ isAdmin: false, email: null, username: null, csrfToken: null });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Session check on mount — no external-store subscription API exists for this, a one-shot fetch is correct here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setAuth({ isAdmin: true, email: data.email, username: data.username, csrfToken: data.csrfToken });
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    setAuth({ isAdmin: true, email: data.email, username: data.username, csrfToken: data.csrfToken });
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", {}, auth.csrfToken);
    } finally {
      setAuth({ isAdmin: false, email: null, username: null, csrfToken: null });
    }
  }, [auth.csrfToken]);

  return (
    <AuthContext.Provider value={{ ...auth, loading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- standard context+hook pairing, not worth a second file
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
