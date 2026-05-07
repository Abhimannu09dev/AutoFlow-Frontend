export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: "customer" | "staff" | "admin";
}

export interface AuthResponse {
  data?: AuthUser;
  token?: string;
  message?: string;
  status?: boolean;
}
