import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getToken, setToken, setUnauthorizedHandler } from "../api/client";
import { getUserDetails, login as loginApi, register as registerApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
  }, [clearSession]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setInitializing(false);
      return;
    }
    getUserDetails()
      .then(setUser)
      .catch(() => clearSession())
      .finally(() => setInitializing(false));
  }, [clearSession]);

  const loginWithToken = useCallback(async (token) => {
    setToken(token);
    const fullUser = await getUserDetails();
    setUser(fullUser);
    return fullUser;
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await loginApi(credentials);
    return loginWithToken(data.token);
  }, [loginWithToken]);

  const register = useCallback(async (payload) => {
    await registerApi(payload);
    return login({ email: payload.workInfo.email, password: payload.password });
  }, [login]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated: Boolean(user),
      initializing,
      login,
      loginWithToken,
      register,
      logout,
    }),
    [user, initializing, login, loginWithToken, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
