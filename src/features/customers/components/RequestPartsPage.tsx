"use client";

import { DashboardLayout } from "../../../shared/components/layout/DashboardLayout";
import { customerNavItems } from "../../../shared/constants/navigation";
import { RequestPartsForm } from "./RequestPartsForm";
import { useAuth } from "../../../contexts/AuthContext";
import { useCustomerData } from "../../../hooks/useCustomer";

export default function RequestPartsPage() {
  const { user } = useAuth();
  const { customer, isLoading } = useCustomerData();

  if (isLoading) {
    return (
      <DashboardLayout
        navItems={customerNavItems}
        brand="AutoFlow"
        subtitle="Manage your vehicles"
        user={{ name: "Loading...", role: "Customer" }}
      >
        <div className="animate-pulse space-y-6 px-8 py-12">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={customerNavItems}
      brand="AutoFlow"
      subtitle="Manage your vehicles"
      user={{
        name: customer?.fullName || user?.name || "Customer",
        role: "Premium Member"
      }}
    >
      <div className="w-full px-8 py-12">
        <RequestPartsForm customerId={user?.id || ''} />
      </div>
    </DashboardLayout>
  );
}