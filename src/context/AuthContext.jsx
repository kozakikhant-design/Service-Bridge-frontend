import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, clearSession, setSession } from "../lib_api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("servicebridge_user")) || null; }
    catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("servicebridge_token");
    if (!token) { setLoading(false); return; }
    api.me()
      .then(({ user: currentUser }) => {
        setUser(currentUser);
        localStorage.setItem("servicebridge_user", JSON.stringify(currentUser));
      })
      .catch(() => { clearSession(); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const result = await api.login({ email, password });
      setSession(result.token, result.user);
      setUser(result.user);
      return { ok: true, user: result.user };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  };

  const register = async (form) => {
    try {
      const result = await api.register(form);
      setSession(result.token, result.user);
      setUser(result.user);
      return { ok: true, user: result.user };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  };

  const logout = () => { clearSession(); setUser(null); };

  const value = useMemo(() => ({ user, loading, login, register, logout, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
