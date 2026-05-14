export type ApiEnvelope<T> = {
  status?: boolean;
  message?: string;
  data?: T;
};

export type Vendor = {
  id: string;
  vendorName: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type StaffMember = {
  id: string;
  staffCode?: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
  position?: string;
  role?: string;
};

export type PartItem = {
  id: string;
  partName: string;
  partNumber?: string;
  brand?: string;
  category?: string;
  description?: string;
  unitPrice?: number;
  sellingPrice?: number;
  stockQuantity?: number;
  minimumStockLevel?: number;
  reorderLevel?: number;
  vendorId?: string;
  vendorName?: string;
  isActive?: boolean;
};

export type PurchaseInvoiceItem = {
  id?: string;
  partId: string;
  partName?: string;
  quantity: number;
  unitCost: number;
  subTotal?: number;
};

export type PurchaseInvoice = {
  id: string;
  vendorId: string;
  vendorName?: string;
  createdByStaffId?: string;
  invoiceDate?: string;
  totalAmount?: number;
  status?: string;
  notes?: string;
  items?: PurchaseInvoiceItem[];
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
  createdAt?: string;
};

export type PartRequestRow = {
  id: string;
  customerId?: string;
  customerName?: string;
  partName?: string;
  quantity?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ReviewRow = {
  id: string;
  customerId?: string;
  customerName?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
};

export type DashboardSummary = {
  totalSalesCount?: number;
  completedSalesCount?: number;
  totalRevenue?: number;
  todayRevenue?: number;
  monthlyRevenue?: number;
  yearlyRevenue?: number;
  totalCustomersCount?: number;
  totalStaffCount?: number;
  totalVendorsCount?: number;
  totalPartsCount?: number;
  totalPurchaseInvoicesCount?: number;
  pendingInvoicesCount?: number;
  totalAppointmentsCount?: number;
  pendingAppointmentsCount?: number;
  pendingPartRequestsCount?: number;
  totalReviewsCount?: number;
  averageReviewRating?: number;
  lowStockPartsCount?: number;
  totalInventoryValue?: number;
  lowStockParts?: number | PartItem[];
};

export type DashboardActivity = {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  actorName?: string;
};

export type DashboardRevenueTrend = {
  label: string;
  date: string;
  revenue: number;
  salesCount: number;
};

export type FastMovingInventoryRow = {
  partId: string;
  partName: string;
  partNumber?: string;
  soldQuantity: number;
  currentStock: number;
  revenue: number;
};

export type PriorityAlertRow = {
  id: string;
  type: string;
  severity: "High" | "Medium" | "Low" | string;
  title: string;
  description: string;
  createdAt: string;
};

export type AdminProfile = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  role?: string;
};

export type PagedResponse<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type FinancialYearly = {
  period?: string;
  totalSales?: number;
  totalRevenue?: number;
  totalDiscount?: number;
  netRevenue?: number;
};
