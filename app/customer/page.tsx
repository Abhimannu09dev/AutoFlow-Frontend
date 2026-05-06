import CustomerShell from "@/components/layout/CustomerShell";
import PageHeader from "@/components/ui/PageHeader";
import StatsRow from "@/components/customer/StatsRow";
import HeroBanner from "@/components/customer/HeroBanner";
import RecentActivity from "@/components/customer/RecentActivity";
import RegisteredVehicles from "@/components/customer/RegisteredVehicles";

export default function CustomerDashboard() {
  return (
    <CustomerShell userName="Alex Sterling" userRole="Premium Member">
      <PageHeader
        title="Welcome back, Alex."
        subtitle="Your garage is looking great. Here's a summary of your performance and upcoming tasks."
      />
      <StatsRow />
      <HeroBanner />
      <div className="grid gap-5 lg:grid-cols-2">
        <RecentActivity />
        <RegisteredVehicles />
      </div>
    </CustomerShell>
  );
}
