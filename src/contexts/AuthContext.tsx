"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/auth.service';

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
  register: (userData: { fullName: string; email: string; password: string; address?: string; phone?: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const currentUser = AuthService.getCurrentUser();
    
    if (currentUser) {
      const authUser: AuthUser = {
        id: currentUser.userId,
        name: currentUser.fullName,
        email: currentUser.email,
        role: currentUser.roles.includes('Customer') ? 'customer' : 
              currentUser.roles.includes('Admin') ? 'admin' : 'staff',
        token: currentUser.token,
      };
      setUser(authUser);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await AuthService.login({ email, password });
      
      if (response.isSuccess) {
        const authUser: AuthUser = {
          id: response.data.userId,
          name: response.data.fullName,
          email: response.data.email,
          role: response.data.roles.includes('Customer') ? 'customer' : 
                response.data.roles.includes('Admin') ? 'admin' : 'staff',
          token: response.data.token,
        };
        
        setUser(authUser);
        return true;
      }
      
      return false;
    } catch (error) {

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
    phone?: string 
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await AuthService.register(userData);
      
      if (response.isSuccess) {
        const authUser: AuthUser = {
          id: response.data.userId,
          name: response.data.fullName,
          email: response.data.email,
          role: response.data.roles.includes('Customer') ? 'customer' : 
                response.data.roles.includes('Admin') ? 'admin' : 'staff',
          token: response.data.token,
        };
        
        setUser(authUser);
        return true;
      }
      
      return false;
    } catch (error) {

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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
