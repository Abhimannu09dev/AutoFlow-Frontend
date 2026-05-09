"use client";

import { useState } from "react";
import { Download, Plus, CheckCircle, XCircle, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "../../../shared/components/layout/DashboardLayout";
import { customerNavItems } from "../../../shared/constants/navigation";
import { Button } from "../../../shared/components/ui/Button";
import { MetricCard } from "../../../shared/components/ui/MetricCard";
import { HistoryTable } from "./HistoryTable";
import { useCustomerData } from "../../../hooks/useCustomer";
import { useAuth } from "../../../contexts/AuthContext";

export default function HistoryPage() {
  const { user } = useAuth();
  const { customer, purchases, isLoading } = useCustomerData();
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);

  // Calculate metrics from real data
  const totalExpenditure = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const completedServices = purchases.filter(p => p.status.toLowerCase() === 'completed').length;
  const pendingOrders = purchases.filter(p => p.status.toLowerCase() === 'pending').length;

  // Calculate loyalty points (example: 1 point per dollar spent)
  const loyaltyPoints = Math.floor(totalExpenditure * 1);
  const pointsToGold = Math.max(0, 3000 - loyaltyPoints);

  // Export to CSV function
  const handleExportCSV = () => {
    console.log('Export CSV clicked');
    setIsExporting(true);

    try {
      // Create CSV content
      const headers = ['Invoice ID', 'Date', 'Items', 'Total Amount', 'Status'];
      const csvRows = [headers.join(',')];

      purchases.forEach((purchase) => {
        const items = purchase.items.length > 0 
          ? purchase.items.map(item => item.partName).join('; ')
          : 'No items';
        
        const row = [
          `INV-${purchase.id.substring(0, 8)}`,
          new Date(purchase.saleDate).toLocaleDateString('en-US'),
          `"${items}"`, // Wrap in quotes to handle commas
          `$${purchase.totalAmount.toFixed(2)}`,
          purchase.status
        ];
        csvRows.push(row.join(','));
      });

      const csvContent = csvRows.join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `purchase-history-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('CSV exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Navigate to parts request page
  const handleNewRequest = () => {
    console.log('New Request clicked');
    router.push('/customer/parts-request');
  };

  // Navigate to technical support (could be a contact page or modal)
  const handleTechSupport = () => {
    console.log('Tech Support clicked');
    // For now, just log. In production, this could open a modal or navigate to support page
    alert('Technical support feature coming soon!');
  };

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
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
        name: customer?.fullName || user?.name || "User",
        role: "Premium Member"
      }}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0f172a]">History</h1>
            <p className="mt-1 text-[14px] text-[#64748b]">
              Access your complete purchase records, service logs, and transaction details in one editorial-focused view.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              className="flex items-center gap-2"
              onClick={handleExportCSV}
              disabled={isExporting || purchases.length === 0}
            >
              <Download size={16} />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={handleNewRequest}
            >
              <Plus size={16} />
              New Request
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Expenditure"
            value={`$${totalExpenditure.toFixed(2)}`}
            subtitle={purchases.length > 0 ? `${purchases.length} transactions` : "No transactions yet"}
            bgColor="bg-[#f0f1fb]"
          />
          <MetricCard
            title="Completed Services"
            value={completedServices.toString()}
            icon={CheckCircle}
            iconColor="text-[#16a34a]"
            iconBg="bg-[#dcfce7]"
          />
          <MetricCard
            title="Pending Orders"
            value={pendingOrders.toString()}
            icon={XCircle}
            iconColor="text-[#dc2626]"
            iconBg="bg-[#fee2e2]"
          />
        </div>

        {/* History Table */}
        <HistoryTable />

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Technical Support Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e293b] to-[#334155] p-8 text-white">
            <div className="relative z-10">
              <h3 className="text-[20px] font-bold mb-2">
                Need technical support for a past purchase?
              </h3>
              <Button 
                variant="secondary" 
                className="mt-4 bg-white text-[#1e293b] hover:bg-gray-100"
                onClick={handleTechSupport}
              >
                Speak to a Tech
              </Button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            {/* Decorative pattern */}
            <div className="absolute -right-8 -top-8 size-32 rounded-full border border-white/10" />
            <div className="absolute -right-4 -top-4 size-24 rounded-full border border-white/5" />
          </div>

          {/* Loyalty Points Card */}
          <div className="rounded-3xl bg-white p-8 border border-[#f1f5f9] shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-[18px] font-bold text-[#0f172a] mb-2">Loyalty Points</h3>
                <p className="text-[13px] text-[#64748b] leading-relaxed">
                  You've earned {loyaltyPoints} points on your previous purchases. 
                  Redeem them for discounts!
                </p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-[#ede9fe]">
                <Tag size={20} className="text-[#4338ca]" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#64748b]">Current Points</span>
                <span className="text-[16px] font-bold text-[#4338ca]">{loyaltyPoints}</span>
              </div>
              <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                <div className="h-full bg-[#4338ca] rounded-full" style={{ width: `${Math.min((loyaltyPoints / 3000) * 100, 100)}%` }} />
              </div>
              <p className="text-[11px] text-[#64748b]">
                {pointsToGold > 0 ? `${pointsToGold} more points to Gold Status` : "Gold Status achieved!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}