"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../shared/components/layout/DashboardLayout";
import { customerNavItems } from "../../../shared/constants/navigation";
import { ReviewForm } from "./ReviewForm";
import { useAuth } from "../../../contexts/AuthContext";
import { useCustomerData } from "../../../hooks/useCustomer";
import { CustomerProfileService } from "../../../services/customerProfile.service";
import type { ReviewResponse } from "../../../types/api";

export default function ReviewsPage() {
  const { user } = useAuth();
  const { customer, isLoading } = useCustomerData();
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Fetch reviews when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await CustomerProfileService.getReviews();
        if (response.isSuccess) {
          setReviews(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (isLoading || reviewsLoading) {
    return (
      <DashboardLayout
        navItems={customerNavItems}
        brand="AutoFlow"
        subtitle="Manage your vehicles"
        user={{ name: "Loading...", role: "Customer" }}
      >
        <div className="animate-pulse space-y-6 py-8">
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
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-[#0f172a] mb-2">Share Your Experience</h1>
          <p className="text-[14px] text-[#64748b]">
            Your feedback helps us maintain the precision of our Kinetic services.
          </p>
        </div>

        <ReviewForm customerId={user?.id || ''} existingReviews={reviews} />
      </div>
    </DashboardLayout>
  );
}