import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { authService } from "../services/authService";
import { tokenStorage } from "../utils/token";
import type { LoginRequest, RegisterRequest } from "../types/auth";

interface AuthContextValue {
  token: string | null;
  email: string | null;
  name: string | null;
  companyName: string | null;

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
  const [companyName, setCompanyName] = useState<string | null>(() => tokenStorage.getCompanyName());


  // Keep state in sync if another tab logs in/out.
  useEffect(() => {
    const onStorage = () => {
      setToken(tokenStorage.get());
      setEmail(tokenStorage.getEmail());
      setName(tokenStorage.getName());
      setCompanyName(tokenStorage.getCompanyName());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

    const login = useCallback(async (payload: LoginRequest) => {
    const res = await authService.login(payload);    

    tokenStorage.set(res.token);
    tokenStorage.setEmail(res.email);
    tokenStorage.setName(res.name);
    tokenStorage.setCompanyName(res.companyName);

    setToken(res.token);
    setEmail(res.email);
    setName(res.name);
    setCompanyName(res.companyName);

  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {

    console.log("REGISTER PAYLOAD", payload);
    const res = await authService.register(payload);
    tokenStorage.set(res.token);
    tokenStorage.setEmail(res.email);
    tokenStorage.setName(res.name);
    tokenStorage.setCompanyName(res.companyName);

    setToken(res.token);
    setEmail(res.email);
    setName(res.name);
    setCompanyName(res.companyName);

  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    setEmail(null);
    setName(null);
    setCompanyName(null);

  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      email,
      name,
      companyName,
      isAuthenticated: !!token,
      login,
      register,
      logout,
    }),
    [token, email, name,companyName, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
