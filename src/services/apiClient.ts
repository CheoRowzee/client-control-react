import axios, { AxiosError } from "axios";
import { tokenStorage } from "../utils/token";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT (if any) to every outbound request.
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();

  console.log("TOKEN:", token);

  if (token) {

    config.headers.Authorization = `Bearer ${token}`;

  }
  return config;
});

// Global 401 handling — token expired or invalid: drop it and bounce to login.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      //tokenStorage.clear();
      // Avoid redirect loops if we're already on the login page.
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);
