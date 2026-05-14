"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin, Heart } from "lucide-react";
import { CustomerProfileService } from "../../../services/customerProfile.service";
import type { CreateReviewRequest, ReviewResponse } from "../../../types/api";
import { StarRating } from "../../../shared/components/ui/StarRating";
import { ServiceCard } from "../../../shared/components/ui/ServiceCard";
import { InfoCard } from "../../../shared/components/ui/InfoCard";
import { Checkbox } from "../../../shared/components/ui/Checkbox";
import { Button } from "../../../shared/components/ui/Button";

interface ReviewFormProps {
  customerId: string;
  existingReviews: ReviewResponse[];
}

export function ReviewForm({ customerId, existingReviews }: ReviewFormProps) {
  const existingReviewCount = existingReviews.length;
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ReviewForm handleSubmit called', { customerId, rating, feedback });
    
    if (!customerId) {
      console.log('No customerId provided');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const reviewData: CreateReviewRequest = {
        customerId: customerId,
        rating: rating,
        comment: feedback || undefined
      };

      console.log('Sending review data:', reviewData);
      const response = await CustomerProfileService.createReview(reviewData);
      console.log('Review response:', response);
      
      if (response.isSuccess) {
        setShowThankYou(true);
      } else {
        console.error('Failed to create review:', response.message);
      }
    } catch (error) {
      console.error('Error creating review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showThankYou) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-[#059669] mb-6">
          <Heart size={24} className="text-white" fill="currentColor" />
        </div>
        <h2 className="text-[24px] font-bold text-[#0f172a] mb-4">
          Thank you for your feedback!
        </h2>
        <p className="text-[14px] text-[#64748b] max-w-md leading-relaxed">
          We truly value the time you take to help us grow. Every word makes the AutoFlow a better place for enthusiasts.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left Side - Review Form */}
      <div className="space-y-8">
        <form onSubmit={handleSubmit}>
          {/* Rating Section */}
          <div className="mb-8">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b] mb-6">
              RATE YOUR RECENT SERVICE
            </h3>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size={20}
              className="mb-8"
            />
          </div>

          {/* Feedback Section */}
          <div className="mb-8">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b] mb-4">
              DETAILED FEEDBACK
            </h3>
            <textarea
              className="w-full h-32 rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[14px] text-[#0f172a] placeholder-[#94a3b8] focus:border-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/20 resize-none"
              placeholder="What stood out about your experience?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {/* Submit Section */}
          <div className="flex items-center justify-between">
            <Checkbox
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              label="Post review anonymously"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              aria-label={existingReviewCount > 0 ? "Submit another review" : "Submit first review"}
              className="px-8"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </div>

      {/* Right Side - Service Info & Cards */}
      <div className="space-y-6">
        {/* Service Card */}
        <ServiceCard
          title="Porsche 911 GT3"
          description="Full Synthetic Oil Change & Inspection"
          status="Completed"
          statusColor="bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]"
          technician={{
            name: "Lead Technician",
            role: "Senior Vogel"
          }}
          image="/car-bg.svg"
        />

        {/* Why Review Card */}
        <InfoCard
          icon={MapPin}
          title="Why review?"
          description="Reviews help our team refine their craftsmanship. Plus, you'll earn 50 Kinetic Points for your next visit!"
          bgColor="bg-[#4338ca]"
          textColor="text-white"
        />

        {/* Car Image Card */}
        <div className="rounded-2xl overflow-hidden">
          <Image
            src="/car-bg.svg"
            alt="Porsche 911 GT3"
            width={1200}
            height={320}
            className="w-full h-32 object-cover"
          />
        </div>
      </div>
    </div>
  );
}
