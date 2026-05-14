"use client";

import { DashboardLayout } from "../../../shared/components/layout/DashboardLayout";
import { customerNavItems } from "../../../shared/constants/navigation";
import { BookingForm } from "./BookingForm";
import { useAuth } from "../../../contexts/AuthContext";
import { useCustomerData } from "../../../hooks/useCustomer";

export default function BookServicePage() {
  const { user } = useAuth();
  const { customer, vehicles, isLoading } = useCustomerData();

  if (isLoading) {
    return (
      <DashboardLayout
        navItems={customerNavItems}
        brand="AutoFlow"
        subtitle="Manage your vehicles"
        user={{ name: "Loading...", role: "Customer" }}
      >
        <div className="animate-pulse space-y-6">
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
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-[#0f172a]">Book Your Service</h1>
        <p className="mt-1 text-[13px] text-[#64748b]">
          Precision care for your high-performance vehicle. Select your requirements below to secure a slot at our atelier.
        </p>
      </div>

      <BookingForm vehicles={vehicles} customerId={customer?.id || ""} />
    </DashboardLayout>
  );
}
