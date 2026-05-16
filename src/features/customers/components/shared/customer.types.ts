export type ApiEnvelope<T> = {
  isSuccess?: boolean;
  IsSuccess?: boolean;
  message?: string;
  Message?: string;
  data?: T;
  Data?: T;
  errorType?: string;
  ErrorType?: string;
};

export type CustomerProfile = {
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
  ownerName?: string;
  createdAt?: string;
  updatedAt?: string;
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

export type SaleItemRow = {
  id?: string;
  partId?: string;
  partName?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
};

export type PurchaseRow = {
  id: string;
  invoiceNumber?: string;
  invoiceNo?: string;
  invoice?: string;
  number?: string;
  customerId?: string;
  customerName?: string;
  saleDate?: string;
  subTotal?: number;
  discountAmount?: number;
  totalAmount?: number;
  loyaltyDiscountApplied?: boolean;
  paymentMethod?: string;
  status?: string;
  notes?: string;
  invoiceSentAt?: string;
  invoiceEmail?: string;
  invoiceFailedAt?: string;
  invoiceFailureReason?: string;
  createdAt?: string;
  items?: SaleItemRow[];
};

export type PartRequestRow = {
  id: string;
  customerId?: string;
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
  fullName?: string;
  name?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PredictionFailure = {
  partName?: string;
  reason?: string;
  severity?: string;
  recommendedAction?: string;
};

export type PredictionRow = {
  vehicleId: string;
  vehicleNumber?: string;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  predictedFailures?: PredictionFailure[];
};
