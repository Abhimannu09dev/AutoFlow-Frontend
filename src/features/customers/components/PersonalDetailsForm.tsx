"use client";

import FormField from "@/shared/components/ui/FormField";
import SectionCard from "@/shared/components/ui/SectionCard";

interface PersonalDetailsFormProps {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  onFullNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBioChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function PersonalDetailsForm({
  fullName, email, phone, location, bio,
  onFullNameChange, onEmailChange, onPhoneChange, onLocationChange, onBioChange,
}: PersonalDetailsFormProps) {
  return (
    <SectionCard className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#c084fc] to-[#818cf8] ring-2 ring-[#e8eaf2]">
          <div className="absolute inset-0 flex items-center justify-center text-white text-[22px] font-bold select-none">
            J
          </div>
        </div>
        <div>
          <h2 className="text-[16px] font-bold text-[#0f172a]">Personal Details</h2>
          <p className="text-[12px] text-[#64748b]">Your public and contact information</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full Name" value={fullName} onChange={onFullNameChange} />
          <FormField label="Email Address" type="email" value={email} onChange={onEmailChange} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Phone Number" type="tel" value={phone} onChange={onPhoneChange} />
          <FormField label="Location" value={location} onChange={onLocationChange} />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={onBioChange}
            rows={3}
            className="w-full resize-none rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-4 py-3 text-[13px] text-[#1e293b] outline-none transition focus:border-[#a5b4fc] focus:ring-2 focus:ring-[#e0e7ff]"
          />
        </div>
      </div>
    </SectionCard>
  );
}
