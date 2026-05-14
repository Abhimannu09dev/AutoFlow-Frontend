"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useContext, useEffect, useState } from "react";

import { AuthService } from "../services/auth.service";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "staff" | "admin";
  token: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    fullName: string;
    email: string;
    password: string;
    address?: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

type AuthPayload = {
  userId?: string;
  fullName?: string;
  email?: string;
  token?: string;
  roles?: string[];
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => undefined,
  isAuthenticated: false,
});

function resolveRole(roles: string[] | undefined): "customer" | "staff" | "admin" {
  if ((roles ?? []).includes("Customer")) return "customer";
  if ((roles ?? []).includes("Admin")) return "admin";
  return "staff";
}

function toAuthUser(payload: AuthPayload | null): AuthUser | null {
  if (!payload?.userId || !payload?.fullName || !payload?.email || !payload?.token) {
    return null;
  }

  return {
    id: payload.userId,
    name: payload.fullName,
    email: payload.email,
    role: resolveRole(payload.roles),
    token: payload.token,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser() as AuthPayload | null;
    setUser(toAuthUser(currentUser));
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await AuthService.login({ email, password });

      if (response.isSuccess) {
        const mapped = toAuthUser(response.data as AuthPayload);
        setUser(mapped);
        return mapped !== null;
      }

      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    fullName: string;
    email: string;
    password: string;
    address?: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await AuthService.register(userData);

      if (response.isSuccess) {
        const mapped = toAuthUser(response.data as AuthPayload);
        setUser(mapped);
        return mapped !== null;
      }

      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
