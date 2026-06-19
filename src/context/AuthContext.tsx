import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { authService } from "../services/authService";
import { tokenStorage } from "../utils/token";
import type { LoginRequest, RegisterRequest } from "../types/auth";

interface AuthContextValue {
  token: string | null;
  email: string | null;
  name: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => tokenStorage.get());
  const [email, setEmail] = useState<string | null>(() => tokenStorage.getEmail());
  const [name, setName] = useState<string | null>(() => tokenStorage.getName());

  // Keep state in sync if another tab logs in/out.
  useEffect(() => {
    const onStorage = () => {
      setToken(tokenStorage.get());
      setEmail(tokenStorage.getEmail());
      setName(tokenStorage.getName());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const res = await authService.login(payload);
    tokenStorage.set(res.token);
    tokenStorage.setEmail(res.email);
    tokenStorage.setName(res.name);
    setToken(res.token);
    setEmail(res.email);
    setName(res.name);
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const res = await authService.register(payload);
    tokenStorage.set(res.token);
    tokenStorage.setEmail(res.email);
    tokenStorage.setName(res.name);
    setToken(res.token);
    setEmail(res.email);
    setName(res.name);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    setEmail(null);
    setName(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      email,
      name,
      isAuthenticated: !!token,
      login,
      register,
      logout,
    }),
    [token, email, name, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
