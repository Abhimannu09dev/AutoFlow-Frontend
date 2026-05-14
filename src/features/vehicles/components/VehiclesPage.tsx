"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Plus, Pencil, Trash2, ArrowRight, ShoppingCart, X,
} from "lucide-react";
import { DashboardLayout } from "../../../shared/components/layout/DashboardLayout";
import { customerNavItems } from "../../../shared/constants/navigation";
import { useCustomerData } from "../../../hooks/useCustomer";
import { useAuth } from "../../../contexts/AuthContext";
import { CustomerProfileService } from "../../../services/customerProfile.service";
import type { VehicleResponseDto } from "../../../types/api";

const recommendedParts = [
  { id: "1", name: "Michelin Pilot Sport 4S", description: "Premium Summer Tires", price: "$1,240", iconType: "tire" as const },
  { id: "2", name: "Liqui Moly 5W-40", description: "Synthetic Race Grade", price: "$85", iconType: "oil" as const },
  { id: "3", name: "Akrapovič Titanium", description: "Exhaust System Upgrade", price: "$4,800", iconType: "exhaust" as const },
];

function TireIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 text-[#4338ca]" stroke="currentColor" strokeWidth={1.6}>
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" />
      <line x1="12" y1="3" x2="12" y2="9" /><line x1="12" y1="15" x2="12" y2="21" />
      <line x1="3" y1="12" x2="9" y2="12" /><line x1="15" y1="12" x2="21" y2="12" />
    </svg>
  );
}

function OilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 text-[#4338ca]" stroke="currentColor" strokeWidth={1.6}>
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <line x1="9" y1="4" x2="9" y2="20" /><line x1="5" y1="9" x2="19" y2="9" /><line x1="5" y1="14" x2="19" y2="14" />
    </svg>
  );
}

function ExhaustIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 text-[#4338ca]" stroke="currentColor" strokeWidth={1.6}>
      <circle cx="6" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18" cy="12" r="2" />
      <line x1="8" y1="12" x2="10" y2="12" /><line x1="14" y1="12" x2="16" y2="12" />
    </svg>
  );
}

const partIconMap = { tire: TireIcon, oil: OilIcon, exhaust: ExhaustIcon };

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-[#4338ca] text-white",
    "IN SERVICE": "bg-[#0d9488] text-white",
    INACTIVE: "bg-[#94a3b8] text-white",
    Active: "bg-[#4338ca] text-white",
    "In Service": "bg-[#0d9488] text-white",
    Inactive: "bg-[#94a3b8] text-white",
  };
  return (
    <span className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles[status] || "bg-[#94a3b8] text-white"}`}>
      {status}
    </span>
  );
}

function VehicleCard({ vehicle, onEdit, onDelete, onViewSpecs }: { 
  vehicle: VehicleResponseDto;
  onEdit: (vehicle: VehicleResponseDto) => void;
  onDelete: (vehicle: VehicleResponseDto) => void;
  onViewSpecs: (vehicle: VehicleResponseDto) => void;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_6px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04]">
      <div className="relative h-44 w-full overflow-hidden bg-[#1a1a2e]">
        <Image src="/car-bg.svg" alt={`${vehicle.brand} ${vehicle.model}`} fill className="object-cover object-center" priority />
        <StatusBadge status="Active" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4338ca]">{vehicle.brand}</p>
        <div className="mt-1 flex items-start justify-between gap-2">
          <h3 className="text-[20px] font-bold leading-tight text-[#0f172a]">{vehicle.model}</h3>
          <span className="mt-1 shrink-0 rounded-lg border border-[#e8eaf2] bg-[#f8f9fc] px-2 py-1 text-[10px] font-semibold text-[#64748b]">{vehicle.vin}</span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-[#f1f3f8] pt-3">
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => onEdit(vehicle)}
              aria-label="Edit vehicle" 
              className="flex size-8 items-center justify-center rounded-lg border border-[#e8eaf2] bg-white text-[#64748b] transition hover:border-[#c7d2fe] hover:bg-[#f5f6ff] hover:text-[#4338ca]"
            >
              <Pencil size={14} strokeWidth={1.8} aria-hidden="true" />
            </button>
            <button 
              type="button" 
              onClick={() => onDelete(vehicle)}
              aria-label="Delete vehicle" 
              className="flex size-8 items-center justify-center rounded-lg border border-[#e8eaf2] bg-white text-[#64748b] transition hover:border-[#fecaca] hover:bg-[#fff5f5] hover:text-[#dc2626]"
            >
              <Trash2 size={14} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>
          <button 
            type="button" 
            onClick={() => onViewSpecs(vehicle)}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4338ca] transition hover:underline"
          >
            View Specs <ArrowRight size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisterVehicleCard({ onClick }: { onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#c7d2fe] bg-[#f8f9ff] transition hover:border-[#818cf8] hover:bg-[#f0f1ff] cursor-pointer min-h-[280px]"
    >
      <button type="button" className="flex flex-col items-center gap-3 p-8 text-center" aria-label="Register new vehicle">
        <div className="flex size-12 items-center justify-center rounded-full border-2 border-[#c7d2fe] bg-white text-[#4338ca]">
          <Plus size={22} strokeWidth={2} aria-hidden="true" />
        </div>
        <div>
          <p className="text-[15px] font-bold text-[#1e293b]">Register New Vehicle</p>
          <p className="mt-1 text-[12px] text-[#94a3b8]">Expand your collection</p>
        </div>
      </button>
    </div>
  );
}

function PartCard({ part, onAddToCart }: { part: typeof recommendedParts[0]; onAddToCart: (part: typeof recommendedParts[0]) => void }) {
  const Icon = partIconMap[part.iconType];
  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 shadow-[0_1px_6px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]">
      <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#eef0fb]">
        <Icon />
      </div>
      <p className="text-[13px] font-bold text-[#1e293b]">{part.name}</p>
      <p className="mt-0.5 text-[11px] text-[#94a3b8]">{part.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[16px] font-bold text-[#4338ca]">{part.price}</span>
        <button 
          type="button" 
          onClick={() => onAddToCart(part)}
          className="flex h-8 items-center gap-1.5 rounded-lg bg-[#4338ca] px-3 text-[11px] font-semibold text-white transition hover:brightness-105"
        >
          <ShoppingCart size={12} aria-hidden="true" /> Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  const { user } = useAuth();
  const { vehicles, isLoading, error, refetchData } = useCustomerData();
  
  // Modal states
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleResponseDto | null>(null);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [addedPart, setAddedPart] = useState<string>("");
  
  // Form states
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    vin: "",
    mileage: "",
    color: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Show notification helper
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handlers
  const handleAddVehicle = () => {

    setFormData({
      brand: "",
      model: "",
      year: "",
      vin: "",
      mileage: "",
      color: ""
    });
    setShowAddVehicleModal(true);
  };

  const handleEditVehicle = (vehicle: VehicleResponseDto) => {

    setSelectedVehicle(vehicle);
    setFormData({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year.toString(),
      vin: vehicle.vin || "",
      mileage: vehicle.mileage.toString(),
      color: vehicle.color || ""
    });
    setShowEditModal(true);
  };

  const handleDeleteVehicle = (vehicle: VehicleResponseDto) => {

    setSelectedVehicle(vehicle);
    setShowDeleteModal(true);
  };

  const handleSaveVehicle = async () => {

    
    // Validate required fields
    if (!formData.brand || !formData.model || !formData.year) {
      showNotification('error', 'Brand, model, and year are required');
      return;
    }

    setIsSaving(true);
    
    try {
      const vehicleData = {
        vehicleNumber: formData.vin || `VEH${Date.now()}`, // Use VIN or generate vehicle number
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        vin: formData.vin,
        mileage: formData.mileage ? parseInt(formData.mileage) : 0,
        color: formData.color
      };

      let response;
      if (showEditModal && selectedVehicle) {
        // Update existing vehicle

        response = await CustomerProfileService.updateVehicle(selectedVehicle.id, vehicleData);
      } else {
        // Add new vehicle

        response = await CustomerProfileService.addVehicle(vehicleData);
      }



      if (response.isSuccess) {
        showNotification('success', showEditModal ? 'Vehicle updated successfully' : 'Vehicle added successfully');
        setShowAddVehicleModal(false);
        setShowEditModal(false);
        setSelectedVehicle(null);
        // Refetch data to update the list
        await refetchData();
      } else {
        showNotification('error', response.message || 'Failed to save vehicle');
      }
    } catch (error) {

      showNotification('error', 'An error occurred while saving the vehicle');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedVehicle) return;
    

    setIsSaving(true);
    
    try {
      const response = await CustomerProfileService.deleteVehicle(selectedVehicle.id);


      if (response.isSuccess) {
        showNotification('success', 'Vehicle deleted successfully');
        setShowDeleteModal(false);
        setSelectedVehicle(null);
        // Refetch data to update the list
        await refetchData();
      } else {
        showNotification('error', response.message || 'Failed to delete vehicle');
      }
    } catch (error) {

      showNotification('error', 'An error occurred while deleting the vehicle');
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewSpecs = (vehicle: VehicleResponseDto) => {

    setSelectedVehicle(vehicle);
    setShowSpecsModal(true);
  };

  const handleAddToCart = (part: typeof recommendedParts[0]) => {

    setAddedPart(part.name);
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 3000);
  };

  const handleBrowseCatalog = () => {

    // In production, this would navigate to the parts catalog
  };

  if (isLoading) {
    return (
      <DashboardLayout
        navItems={customerNavItems}
        brand="AutoFlow"
        subtitle="Manage your vehicles"
        user={user ? { name: user.name, role: user.role } : { name: "Loading...", role: "Customer" }}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4338ca] mx-auto"></div>
            <p className="mt-2 text-[13px] text-[#64748b]">Loading vehicles...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        navItems={customerNavItems}
        brand="AutoFlow"
        subtitle="Manage your vehicles"
        user={user ? { name: user.name, role: user.role } : { name: "User", role: "Customer" }}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-[13px] text-red-600">Error loading vehicles: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={customerNavItems}
      brand="AutoFlow"
      subtitle="Manage your vehicles"
      user={user ? { name: user.name, role: user.role } : { name: "User", role: "Customer" }}
    >
      {/* Success/Error Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 shadow-lg ${
          notification.type === 'success' 
            ? 'border-[#bbf7d0] bg-[#f0fdf4] text-[#16a34a]' 
            : 'border-[#fecaca] bg-[#fef2f2] text-[#dc2626]'
        }`}>
          <p className="text-[13px] font-semibold">{notification.message}</p>
        </div>
      )}

      {/* Cart Notification */}
      {showCartNotification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 shadow-lg">
          <ShoppingCart size={16} className="text-[#16a34a]" />
          <p className="text-[13px] font-semibold text-[#16a34a]">{addedPart} added to cart!</p>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-[#0f172a]">Garage</h1>
          <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-[#64748b]">
            Access your curated collection of high-performance vehicles. Manage technical specs, service records, and parts availability in one seamless interface.
          </p>
        </div>
        <button 
          type="button" 
          onClick={handleAddVehicle}
          className="flex h-10 items-center gap-2 rounded-xl bg-[#4338ca] px-5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(67,56,202,0.3)] transition hover:brightness-105"
        >
          <Plus size={16} strokeWidth={2.2} aria-hidden="true" /> Add Vehicle
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard 
            key={vehicle.id} 
            vehicle={vehicle}
            onEdit={handleEditVehicle}
            onDelete={handleDeleteVehicle}
            onViewSpecs={handleViewSpecs}
          />
        ))}
        <RegisterVehicleCard onClick={handleAddVehicle} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-[#0f172a]">Recommended Performance Parts</h2>
          <button 
            type="button" 
            onClick={handleBrowseCatalog}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#4338ca] transition hover:underline"
          >
            Browse Catalog
            <svg viewBox="0 0 12 12" fill="none" className="size-3 ml-0.5" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path d="M2 10L10 2M10 2H5M10 2v5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recommendedParts.map((part) => (
            <PartCard key={part.id} part={part} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </div>

      {/* Add/Edit Vehicle Modal */}
      {(showAddVehicleModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#0f172a]">
                {showEditModal ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddVehicleModal(false);
                  setShowEditModal(false);
                  setSelectedVehicle(null);
                }}
                className="text-[#64748b] hover:text-[#0f172a]"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6 text-[13px] text-[#64748b]">
              {showEditModal 
                ? 'Update your vehicle information below.' 
                : 'Add a new vehicle to your garage.'}
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Brand (e.g., Toyota)"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-4 py-3 text-[13px] outline-none focus:border-[#4338ca] focus:ring-2 focus:ring-[#4338ca]/20"
              />
              <input
                type="text"
                placeholder="Model (e.g., Camry)"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-4 py-3 text-[13px] outline-none focus:border-[#4338ca] focus:ring-2 focus:ring-[#4338ca]/20"
              />
              <input
                type="number"
                placeholder="Year (e.g., 2020)"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-4 py-3 text-[13px] outline-none focus:border-[#4338ca] focus:ring-2 focus:ring-[#4338ca]/20"
              />
              <input
                type="text"
                placeholder="VIN"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                className="w-full rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-4 py-3 text-[13px] outline-none focus:border-[#4338ca] focus:ring-2 focus:ring-[#4338ca]/20"
              />
              <input
                type="number"
                placeholder="Mileage (optional)"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                className="w-full rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-4 py-3 text-[13px] outline-none focus:border-[#4338ca] focus:ring-2 focus:ring-[#4338ca]/20"
              />
              <input
                type="text"
                placeholder="Color (optional)"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-4 py-3 text-[13px] outline-none focus:border-[#4338ca] focus:ring-2 focus:ring-[#4338ca]/20"
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddVehicleModal(false);
                  setShowEditModal(false);
                  setSelectedVehicle(null);
                }}
                disabled={isSaving}
                className="flex-1 rounded-xl border border-[#e8eaf2] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#64748b] transition hover:bg-[#f8f9fc] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveVehicle}
                disabled={isSaving}
                className="flex-1 rounded-xl bg-[#4338ca] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : (showEditModal ? 'Update' : 'Add')} Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-[18px] font-bold text-[#0f172a] mb-2">Delete Vehicle</h3>
            <p className="mb-6 text-[13px] text-[#64748b]">
              Are you sure you want to delete <strong>{selectedVehicle.year} {selectedVehicle.brand} {selectedVehicle.model}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedVehicle(null);
                }}
                disabled={isSaving}
                className="flex-1 rounded-xl border border-[#e8eaf2] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#64748b] transition hover:bg-[#f8f9fc] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isSaving}
                className="flex-1 rounded-xl bg-[#dc2626] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Specs Modal */}
      {showSpecsModal && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#0f172a]">Vehicle Specifications</h3>
              <button
                type="button"
                onClick={() => {
                  setShowSpecsModal(false);
                  setSelectedVehicle(null);
                }}
                className="text-[#64748b] hover:text-[#0f172a]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[#f1f3f8]">
                <span className="text-[12px] font-semibold text-[#64748b]">Brand</span>
                <span className="text-[13px] font-semibold text-[#0f172a]">{selectedVehicle.brand}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#f1f3f8]">
                <span className="text-[12px] font-semibold text-[#64748b]">Model</span>
                <span className="text-[13px] font-semibold text-[#0f172a]">{selectedVehicle.model}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#f1f3f8]">
                <span className="text-[12px] font-semibold text-[#64748b]">Year</span>
                <span className="text-[13px] font-semibold text-[#0f172a]">{selectedVehicle.year}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#f1f3f8]">
                <span className="text-[12px] font-semibold text-[#64748b]">VIN</span>
                <span className="text-[13px] font-semibold text-[#0f172a]">{selectedVehicle.vin}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#f1f3f8]">
                <span className="text-[12px] font-semibold text-[#64748b]">Mileage</span>
                <span className="text-[13px] font-semibold text-[#0f172a]">{selectedVehicle.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#f1f3f8]">
                <span className="text-[12px] font-semibold text-[#64748b]">Color</span>
                <span className="text-[13px] font-semibold text-[#0f172a]">{selectedVehicle.color || 'N/A'}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowSpecsModal(false);
                setSelectedVehicle(null);
              }}
              className="mt-6 w-full rounded-xl bg-[#4338ca] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
