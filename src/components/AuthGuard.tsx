"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "customer" | "staff";
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // No user logged in, redirect to login
        router.push("/login");
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        // User doesn't have required role, redirect to appropriate dashboard
        if (user.role === "customer") {
          router.push("/customer/dashboard");
        } else {
          router.push("/staff/dashboard");
        }
        return;
      }
    }
  }, [user, isLoading, router, requiredRole]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user || (requiredRole && user.role !== requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">Redirecting...</div>
      </div>
    );
  }

  return <>{children}</>;
}