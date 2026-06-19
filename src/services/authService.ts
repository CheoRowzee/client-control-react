import { apiClient } from "./apiClient";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("https://localhost:44358/api/auth/login", payload);
    return data;
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("https://localhost:44358/api/auth/register", payload);
    return data;
  },
};
