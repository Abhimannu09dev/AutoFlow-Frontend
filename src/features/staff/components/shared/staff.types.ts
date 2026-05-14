export type CustomerRow = {
  id: string;
  applicationUserId?: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: string;
};

export type VehicleRow = {
  id: string;
  vehicleNumber?: string;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  color?: string;
  vin?: string;
  userId?: string;
  customerId?: string;
  applicationUserId?: string;
  ownerId?: string;
  ownerName?: string;
  ownerDisplay?: string;
  ownerRef?: string;
  createdAt?: string;
};

export type AppointmentRow = {
  id: string;
  customerId?: string;
  vehicleId?: string;
  vehicleNumber?: string;
  date?: string;
  time?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PartRow = {
  id: string;
  partName?: string;
  partNumber?: string;
  brand?: string;
  category?: string;
  unitPrice?: number;
  sellingPrice?: number;
  stockQuantity?: number;
  minimumStockLevel?: number;
  vendorName?: string;
};

export type PartRequestRow = {
  id: string;
  customerId?: string;
  customerName?: string;
  partName?: string;
  quantity?: number;
  status?: string;
  createdAt?: string;
};

export type SaleRow = {
  id: string;
  invoiceNumber?: string;
  customerId?: string;
  customerName?: string;
  staffId?: string;
  saleDate?: string;
  paymentMethod?: string;
  subTotal?: number;
  discountAmount?: number;
  totalAmount?: number;
  status?: string;
  notes?: string;
  invoiceSentAt?: string;
  invoiceFailedAt?: string;
  invoiceFailureReason?: string;
  items?: SaleItemRow[];
  createdAt?: string;
};

export type SaleItemRow = {
  id?: string;
  partId?: string;
  partName?: string;
  partNumber?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
};

export type ReviewRow = {
  id: string;
  customerId?: string;
  customerName?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
};

export type StaffProfileRow = {
  id: string;
  applicationUserId?: string;
  staffCode?: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  position?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type DashboardSummary = {
  totalAppointmentsCount?: number;
  pendingAppointmentsCount?: number;
  totalRevenue?: number;
  totalSalesCount?: number;
  lowStockPartsCount?: number;
  pendingPartRequestsCount?: number;
};
