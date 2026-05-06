"use client";

import { useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import CustomerShell from "@/components/layout/CustomerShell";
import PageHeader from "@/components/ui/PageHeader";
import PersonalDetailsForm from "@/components/customer/PersonalDetailsForm";
import PasswordForm from "@/components/customer/PasswordForm";
import MembershipCard from "@/components/customer/MembershipCard";

export default function CustomerProfile() {
  const [fullName, setFullName] = useState("Julianne Blackwood");
  const [email, setEmail] = useState("j.blackwood@nexus.com");
  const [phone, setPhone] = useState("+1 (555) 234-8901");
  const [location, setLocation] = useState("San Francisco, CA");
  const [bio, setBio] = useState(
    "Passionate car enthusiast and technology professional. Always looking for the best performance parts for my collection."
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toast = saved ? (
    <div className="flex items-center gap-2 rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-2 text-[12px] font-semibold text-[#16a34a] shadow-sm">
      <CheckCircle2 size={14} aria-hidden="true" />
      Profile updated successfully
    </div>
  ) : undefined;

  return (
    <CustomerShell userName="Alex Sterling" userRole="Premium Member">
      <PageHeader
        title="Account Settings"
        subtitle="Manage your personal information and security preferences."
        actions={toast}
      />
      <div className="grid items-start gap-5 xl:grid-cols-[3fr_2fr]">
        <div className="space-y-5">
          <PersonalDetailsForm
            fullName={fullName}
            email={email}
            phone={phone}
            location={location}
            bio={bio}
            onFullNameChange={(e) => setFullName(e.target.value)}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPhoneChange={(e) => setPhone(e.target.value)}
            onLocationChange={(e) => setLocation(e.target.value)}
            onBioChange={(e) => setBio(e.target.value)}
          />
          <PasswordForm />
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#4338ca] p-6 text-white shadow-[0_4px_16px_rgba(67,56,202,0.3)]">
            <h3 className="text-[20px] font-bold leading-snug">
              Ready to update<br />your profile?
            </h3>
            <p className="mt-3 text-[12px] leading-relaxed text-[#c7d2fe]">
              Ensure your contact details are up to date to receive the latest service alerts
              and exclusive part offers.
            </p>
            <button
              type="button"
              onClick={handleSave}
              suppressHydrationWarning
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-[13px] font-bold text-[#4338ca] transition hover:bg-[#eef0fb]"
            >
              <Save size={15} aria-hidden="true" />
              Save Changes
            </button>
          </div>
          <MembershipCard />
        </div>
      </div>
    </CustomerShell>
  );
}
