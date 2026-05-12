"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { CustomerProfileService } from "../../../services/customerProfile.service";
import type { VehicleResponseDto, CreateAppointmentRequest } from "../../../types/api";

interface BookingFormProps {
  vehicles: VehicleResponseDto[];
  customerId: string;
}

interface BookingFormData {
  vehicle: string;
  serviceType: string;
  date: Date | null;
  time: string;
}

interface BookingFormErrors {
  vehicle?: string;
  serviceType?: string;
  date?: string;
  time?: string;
}

const serviceTypes = [
  { value: "oil-change-filter", label: "Oil Change & Filter Service", price: 285.00 },
  { value: "brake-inspection", label: "Brake Inspection & Service", price: 450.00 },
  { value: "engine-diagnostic", label: "Engine Diagnostic", price: 195.00 },
  { value: "transmission-service", label: "Transmission Service", price: 650.00 },
  { value: "tire-rotation", label: "Tire Rotation & Balance", price: 125.00 },
];

export function BookingForm({ vehicles, customerId }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    vehicle: "",
    serviceType: "oil-change-filter",
    date: null,
    time: "",
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Set default vehicle when vehicles are loaded
  useEffect(() => {
    if (vehicles.length > 0 && !formData.vehicle) {
      setFormData(prev => ({ ...prev, vehicle: vehicles[0].id }));
    }
  }, [vehicles, formData.vehicle]);

  const validateForm = (): boolean => {
    const newErrors: BookingFormErrors = {};

    if (!formData.vehicle) {
      newErrors.vehicle = "Please select a vehicle";
    }

    if (!formData.serviceType) {
      newErrors.serviceType = "Please select a service type";
    }

    if (!formData.date) {
      newErrors.date = "Please select a date";
    } else {
      // Check if date is in the past (before today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.date);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = "Please select a future date";
      }
    }

    if (!formData.time) {
      newErrors.time = "Please select a time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('BookingForm handleSubmit called', { customerId, formData });
    
    if (!customerId) {
      setSubmitError("User not authenticated");
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!formData.date || !formData.time) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      const appointmentData: CreateAppointmentRequest = {
        customerId: customerId,
        date: formData.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        time: convertTo24Hour(formData.time),
        status: "Scheduled"
      };

      console.log('Sending appointment data:', appointmentData);
      const response = await CustomerProfileService.createAppointment(appointmentData);
      console.log('Appointment response:', response);
      
      if (response.isSuccess) {
        setShowConfirmation(true);
        // Reset form after successful booking
        setFormData({
          vehicle: vehicles.length > 0 ? vehicles[0].id : "",
          serviceType: "oil-change-filter",
          date: null,
          time: "",
        });
        // Hide confirmation after 5 seconds
        setTimeout(() => setShowConfirmation(false), 5000);
      } else {
        setSubmitError(response.message || "Failed to book appointment. Please try again.");
      }
    } catch (error) {
      console.error('Appointment booking error:', error);
      setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    return `${hours}:${minutes}:00`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateSelected = (date: Date | null) => {
    if (!date || !formData.date) return false;
    return date.toDateString() === formData.date.toDateString();
  };

  const days = getDaysInMonth(currentMonth);
  const timeSlots = [
    "08:00 AM", "09:15 AM", "10:00 AM", "11:30 AM",
    "01:00 PM", "02:45 PM", "04:00 PM", "05:30 PM"
  ];

  // Create vehicle options from API data
  const vehicleOptions = vehicles.map(vehicle => ({
    value: vehicle.id,
    label: `${vehicle.year} ${vehicle.brand} ${vehicle.model} (${vehicle.color || 'N/A'})`
  }));

  if (vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#64748b]">No vehicles found. Please add a vehicle to your profile first.</div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex gap-8">
      {/* Main Form */}
      <div className="flex-1 space-y-8">
        {/* Vehicle and Service Selection */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b] mb-3">
              SELECT VEHICLE
            </label>
            <div className="relative">
              <select
                className={`w-full appearance-none rounded-xl border ${errors.vehicle ? 'border-red-500' : 'border-[#e2e8f0]'} bg-white px-4 py-3 text-[13px] text-[#0f172a] focus:border-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/20`}
                value={formData.vehicle}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, vehicle: e.target.value }));
                  if (errors.vehicle) {
                    setErrors(prev => ({ ...prev, vehicle: undefined }));
                  }
                }}
                required
              >
                <option value="">Select a vehicle...</option>
                {vehicleOptions.map((vehicle) => (
                  <option key={vehicle.value} value={vehicle.value}>
                    {vehicle.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none" />
            </div>
            {errors.vehicle && (
              <p className="mt-1 text-[11px] text-red-600">{errors.vehicle}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b] mb-3">
              SERVICE TYPE
            </label>
            <div className="relative">
              <select
                className={`w-full appearance-none rounded-xl border ${errors.serviceType ? 'border-red-500' : 'border-[#e2e8f0]'} bg-white px-4 py-3 text-[13px] text-[#0f172a] focus:border-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/20`}
                value={formData.serviceType}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, serviceType: e.target.value }));
                  if (errors.serviceType) {
                    setErrors(prev => ({ ...prev, serviceType: undefined }));
                  }
                }}
                required
              >
                {serviceTypes.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none" />
            </div>
            {errors.serviceType && (
              <p className="mt-1 text-[11px] text-red-600">{errors.serviceType}</p>
            )}
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b] mb-4">
            SELECT DATE
          </label>

          <div className="max-w-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#0f172a]">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => navigateMonth('prev')}
                  className="flex size-8 items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => navigateMonth('next')}
                  className="flex size-8 items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                <div key={day} className="flex h-10 items-center justify-center text-[11px] font-medium text-[#64748b]">
                  {day}
                </div>
              ))}

              {days.map((date, index) => (
                <div key={index} className="flex h-10 items-center justify-center">
                  {date && (
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Date selected:', date);
                        setFormData(prev => ({ ...prev, date }));
                        if (errors.date) {
                          setErrors(prev => ({ ...prev, date: undefined }));
                        }
                      }}
                      className={`
                        flex size-8 items-center justify-center rounded-lg text-[13px] font-medium transition
                        ${isDateSelected(date)
                          ? 'bg-[#4338ca] text-white'
                          : 'text-[#0f172a] hover:bg-[#f1f5f9]'
                        }
                      `}
                    >
                      {date.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.date && (
              <p className="mt-2 text-[11px] text-red-600">{errors.date}</p>
            )}
          </div>
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b] mb-4">
            SELECT TIME SLOT
          </label>

          <div className="grid grid-cols-4 gap-3 max-w-lg">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  console.log('Time slot selected:', slot);
                  setFormData(prev => ({ ...prev, time: slot }));
                  if (errors.time) {
                    setErrors(prev => ({ ...prev, time: undefined }));
                  }
                }}
                className={`
                  rounded-xl px-4 py-3 text-[13px] font-medium transition
                  ${formData.time === slot
                    ? 'bg-[#4338ca] text-white'
                    : 'border border-[#e2e8f0] bg-white text-[#0f172a] hover:bg-[#f8f9fc]'
                  }
                `}
              >
                {slot}
              </button>
            ))}
          </div>
          {errors.time && (
            <p className="mt-2 text-[11px] text-red-600">{errors.time}</p>
          )}
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="w-80 space-y-4">
        {/* Summary Card */}
        <div className="rounded-2xl bg-[#e8eeff] p-6">
          <h3 className="text-[18px] font-bold text-[#0f172a] mb-4">Summary</h3>

          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                SERVICE
              </p>
              <p className="mt-1 text-[13px] font-medium text-[#0f172a]">
                {serviceTypes.find(s => s.value === formData.serviceType)?.label || "Oil Change & Filter"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                DATE & TIME
              </p>
              <p className={`mt-1 text-[13px] font-medium ${formData.date && formData.time ? 'text-[#0f172a]' : 'text-[#94a3b8]'}`}>
                {formData.date && formData.time 
                  ? `${formatDate(formData.date)} at ${formData.time}` 
                  : "Please select date and time"}
              </p>
            </div>

            <div className="border-t border-[#d1d9ff] pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[15px] font-medium text-[#0f172a]">Total Est.</span>
                <span className="text-[24px] font-bold text-[#4338ca]">
                  ${(serviceTypes.find(s => s.value === formData.serviceType)?.price || 285.00).toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                Tax and additional parts may vary upon physical inspection of the vehicle.
              </p>
            </div>

            {submitError && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3">
                <p className="text-[12px] text-red-600">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !formData.vehicle || !formData.date || !formData.time}
              className="w-full rounded-xl bg-[#4338ca] py-3 text-[14px] font-semibold text-white hover:brightness-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </div>

        {/* Confirmation Message */}
        {showConfirmation && (
          <div className="rounded-2xl bg-[#dcfce7] border border-[#bbf7d0] p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-6 items-center justify-center rounded-full bg-[#16a34a] text-white mt-0.5">
                <CheckCircle size={14} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#15803d]">
                  Your appointment has been scheduled successfully!
                </p>
                <p className="mt-1 text-[11px] text-[#16a34a]">
                  A confirmation email will be sent shortly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Location Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#334155] p-6 text-white">
          <div className="relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
              OUR LOCATION
            </p>
            <p className="mt-2 text-[16px] font-bold">AutoFlow HQ - Munich</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>
      </div>
    </form>
  );
}