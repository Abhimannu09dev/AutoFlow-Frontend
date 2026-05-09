"use client";

import { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { DataTable } from "../../../shared/components/ui/DataTable";
import { StatusBadge } from "../../../shared/components/ui/StatusBadge";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { useAuth } from "../../../contexts/AuthContext";
import { CustomerProfileService } from "../../../services/customerProfile.service";
import type { SaleResponse } from "../../../types/api";

interface HistoryTableData {
  invoiceId: string;
  date: string;
  items: string;
  totalAmount: string;
  status: "completed" | "pending" | "refunded";
  originalData: SaleResponse;
}

const columns = [
  { key: "invoiceId", label: "INVOICE ID", width: "col-span-2" },
  { key: "date", label: "DATE", width: "col-span-2" },
  { key: "items", label: "ITEMS", width: "col-span-4" },
  { key: "totalAmount", label: "TOTAL AMOUNT", width: "col-span-2", align: "right" as const },
  { key: "status", label: "STATUS", width: "col-span-1", align: "center" as const },
  { key: "action", label: "ACTION", width: "col-span-1", align: "center" as const }
];

export function HistoryTable() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [purchases, setPurchases] = useState<SaleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<SaleResponse | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await CustomerProfileService.getPurchases();
        
        if (response.isSuccess) {
          setPurchases(response.data);
        } else {
          setError(response.message || 'Failed to fetch purchase history');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch purchase history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, [user?.id]);

  // Handle view invoice
  const handleViewInvoice = (purchase: SaleResponse) => {
    console.log('View invoice clicked:', purchase);
    setSelectedInvoice(purchase);
    setShowInvoiceModal(true);
  };

  // Transform API data to table format
  const transformedData: HistoryTableData[] = purchases.map((purchase) => {
    const itemsText = purchase.items.length > 0 
      ? purchase.items.map(item => item.partName).join(', ')
      : 'No items';
    
    const truncatedItems = itemsText.length > 40 
      ? itemsText.substring(0, 40) + '...' 
      : itemsText;

    return {
      invoiceId: `INV-${purchase.id.substring(0, 8)}`,
      date: new Date(purchase.saleDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
      }),
      items: truncatedItems,
      totalAmount: `$${purchase.totalAmount.toFixed(2)}`,
      status: purchase.status.toLowerCase() as "completed" | "pending" | "refunded",
      originalData: purchase
    };
  });

  // Pagination logic
  const totalPages = Math.ceil(transformedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = transformedData.slice(startIndex, endIndex);
  
  const showingText = `Showing ${startIndex + 1}-${Math.min(endIndex, transformedData.length)} of ${transformedData.length} invoices`;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">Error loading purchase history</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (transformedData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No purchase history found</p>
        </div>
      </div>
    );
  }

  const renderCell = (key: string, value: any, row: HistoryTableData) => {
    switch (key) {
      case "invoiceId":
        return (
          <div>
            <p className="font-semibold text-[#0f172a]">{value}</p>
          </div>
        );
      case "date":
        return <span className="text-[#64748b]">{value}</span>;
      case "items":
        return <span className="text-[#0f172a]">{value}</span>;
      case "totalAmount":
        return <span className="font-semibold text-[#0f172a]">{value}</span>;
      case "status":
        return <StatusBadge status={value} />;
      case "action":
        return (
          <button 
            onClick={() => handleViewInvoice(row.originalData)}
            className="flex items-center gap-1 text-[#4338ca] hover:underline text-[12px] font-medium"
          >
            <Eye size={14} />
            View
          </button>
        );
      default:
        return value;
    }
  };

  return (
    <>
      <div className="space-y-6">
        <DataTable
          columns={columns}
          data={currentData}
          renderCell={renderCell}
        />
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showingText={showingText}
        />
      </div>

      {/* Invoice Details Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[20px] font-bold text-[#0f172a]">Invoice Details</h3>
              <button
                type="button"
                onClick={() => {
                  setShowInvoiceModal(false);
                  setSelectedInvoice(null);
                }}
                className="text-[#64748b] hover:text-[#0f172a]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="border-b border-[#f1f3f8] pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[12px] font-semibold text-[#64748b] uppercase tracking-wide">Invoice ID</p>
                    <p className="text-[16px] font-bold text-[#0f172a]">INV-{selectedInvoice.id.substring(0, 8)}</p>
                  </div>
                  <StatusBadge status={selectedInvoice.status.toLowerCase() as any} />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wide">Date</p>
                    <p className="text-[13px] text-[#0f172a]">
                      {new Date(selectedInvoice.saleDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wide">Payment Method</p>
                    <p className="text-[13px] text-[#0f172a]">{selectedInvoice.paymentMethod || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <p className="text-[12px] font-semibold text-[#64748b] uppercase tracking-wide mb-3">Items</p>
                <div className="space-y-2">
                  {selectedInvoice.items.length > 0 ? (
                    selectedInvoice.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-[#f1f3f8]">
                        <div>
                          <p className="text-[13px] font-medium text-[#0f172a]">{item.partName}</p>
                          <p className="text-[11px] text-[#64748b]">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-[13px] font-semibold text-[#0f172a]">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[13px] text-[#64748b]">No items</p>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-[#f1f3f8] pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-[14px] font-semibold text-[#0f172a]">Total Amount</p>
                  <p className="text-[20px] font-bold text-[#4338ca]">${selectedInvoice.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setShowInvoiceModal(false);
                  setSelectedInvoice(null);
                }}
                className="w-full rounded-xl bg-[#4338ca] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
