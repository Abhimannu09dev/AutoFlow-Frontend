"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ArrowRight, Search, Users, Globe } from "lucide-react";
import { CustomerProfileService } from "../../../services/customerProfile.service";
import type { VehicleResponseDto } from "../../../types/api";
import { Alert } from "../../../shared/components/ui/Alert";
import { Input } from "../../../shared/components/ui/Input";
import { FeatureCard } from "../../../shared/components/ui/FeatureCard";
import { StatBadge } from "../../../shared/components/ui/StatBadge";
import { Button } from "../../../shared/components/ui/Button";

interface RequestPartsFormProps {
  customerId: string;
}

export function RequestPartsForm({ customerId }: RequestPartsFormProps) {
  const [formData, setFormData] = useState({
    partIdentity: "",
    assignedVehicle: "",
    description: "",
    quantity: 1,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleResponseDto[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

  // Fetch vehicles when component mounts
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!customerId) return;
      
      try {
        const response = await CustomerProfileService.getVehicles();
        if (response.isSuccess) {
          setVehicles(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      } finally {
        setVehiclesLoading(false);
      }
    };

    fetchVehicles();
  }, [customerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('RequestPartsForm handleSubmit called', { customerId, formData });
    
    if (!customerId || !formData.partIdentity) {
      console.log('Validation failed:', { customerId, partIdentity: formData.partIdentity });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const requestData = {
        customerId: customerId,
        partName: formData.partIdentity,
        quantity: formData.quantity,
        status: "Pending"
      };

      console.log('Sending part request data:', requestData);
      const response = await CustomerProfileService.createPartRequest(requestData);
      console.log('Part request response:', response);
      
      if (response.isSuccess) {
        setShowSuccess(true);
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            partIdentity: "",
            assignedVehicle: vehicles.length > 0 ? vehicles[0].id : "",
            description: "",
            quantity: 1,
          });
          setShowSuccess(false);
        }, 5000);
      } else {
        console.error('Failed to create part request:', response.message);
      }
    } catch (error) {
      console.error('Error creating part request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create vehicle options from API data
  const vehicleOptions = [
    { value: "", label: "Select from your garage" },
    ...vehicles.map(vehicle => ({
      value: vehicle.id,
      label: `${vehicle.year} ${vehicle.brand} ${vehicle.model} (${vehicle.color || 'N/A'})`
    }))
  ];

  if (vehiclesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#64748b]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none">
      {/* Success Alert */}
      {showSuccess && (
        <div className="mb-8">
          <Alert
            type="success"
            title="Success!"
            message="We'll notify you when the part is in stock via email and push notification."
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
        {/* Left Content */}
        <div className="space-y-8">
          <div>
            <h1 className="text-[36px] xl:text-[42px] font-bold text-[#0f172a] leading-tight mb-6">
              Can&apos;t find what you&apos;re looking for?
            </h1>
            
            <p className="text-[16px] text-[#64748b] leading-relaxed max-w-lg">
              Our atelier specializes in sourcing rare and high-performance components. 
              Submit a request and our procurement specialists will track it down for you.
            </p>
          </div>

          <div className="space-y-8">
            <FeatureCard
              icon={Search}
              title="Priority Sourcing"
              description="Direct access to global manufacturer networks."
              iconColor="text-[#4338ca]"
              iconBg="bg-[#ede9fe]"
            />
            
            <FeatureCard
              icon={Users}
              title="Certified Genuine"
              description="Every sourced part undergoes 12-point quality check."
              iconColor="text-[#4338ca]"
              iconBg="bg-[#ede9fe]"
            />
          </div>
        </div>

        {/* Right Form */}
        <div className="bg-white rounded-3xl p-8 xl:p-10 shadow-[0_4px_24px_rgba(15,23,42,0.08)] border border-[#f1f5f9]">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-[20px] font-semibold text-[#0f172a] mb-6">Request Part</h2>
              
              <div className="space-y-6">
                <Input
                  label="PART IDENTITY"
                  placeholder="e.g. Carbon Ceramic Brake Pad"
                  value={formData.partIdentity}
                  onChange={(e) => setFormData(prev => ({ ...prev, partIdentity: e.target.value }))}
                  required
                />

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b] mb-3">
                    ASSIGNED VEHICLE
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none rounded-xl border border-[#e2e8f0] bg-white px-4 py-4 text-[14px] text-[#0f172a] focus:border-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/20 transition-colors"
                      value={formData.assignedVehicle}
                      onChange={(e) => setFormData(prev => ({ ...prev, assignedVehicle: e.target.value }))}
                    >
                      {vehicleOptions.map((vehicle) => (
                        <option key={vehicle.value} value={vehicle.value}>
                          {vehicle.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b] mb-3">
                    QUANTITY
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-4 text-[14px] text-[#0f172a] focus:border-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/20 transition-colors"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b] mb-3">
                    DESCRIPTION / NOTES
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-4 text-[14px] text-[#0f172a] placeholder-[#94a3b8] focus:border-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/20 resize-none transition-colors"
                    rows={5}
                    placeholder="Mention specific serial numbers, brands, or urgency levels..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !formData.partIdentity}
              className="w-full flex items-center justify-center gap-3 h-12 text-[15px] font-semibold"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
              <ArrowRight size={18} />
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="flex items-center justify-center gap-8 pt-16 mt-16 border-t border-[#f1f5f9]">
        <StatBadge icon={Search} label="48h Sourcing Avg." />
        <StatBadge icon={Users} label="Personal Liaison" />
        <StatBadge icon={Globe} label="Global Ex." />
      </div>
    </div>
  );
}
