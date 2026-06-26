export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  companyName: string;

}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  email: string;
  name: string;
  companyName: string;
}
