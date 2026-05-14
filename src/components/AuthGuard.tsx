"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useAuth } from "../contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "customer" | "staff" | "admin";
}

function GuardShell({ label }: { label: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-slate-500">{label}</div>
    </div>
  );
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const roleMismatch = useMemo(() => {
    if (!requiredRole || !user) return false;
    return user.role !== requiredRole;
  }, [requiredRole, user]);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      if (user.role === "customer") {
        router.replace("/customer/dashboard");
      } else if (user.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/staff/dashboard");
      }
    }
  }, [isLoading, requiredRole, router, user]);

  if (isLoading) {
    return <GuardShell label="Loading..." />;
  }

  if (!user || roleMismatch) {
    return <GuardShell label="Redirecting..." />;
  }

  return <>{children}</>;
}
