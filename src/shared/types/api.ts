// Base API Response Types
export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string | null;
  data: T;
  errorType: ErrorType;
}

export enum ErrorType {
  None = "None",
  NotFound = "NotFound",
  ValidationError = "ValidationError",
  Conflict = "Conflict",
  Unauthorized = "Unauthorized"
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  address?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  userId: string;
  fullName: string;
  roles: string[];
}

// Customer Types
export interface CustomerResponseDto {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  applicationUserId?: string;
}

// Vehicle Types
export interface VehicleResponseDto {
  id: string;
  vehicleNumber: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  vin?: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface VehicleCreateDto {
  vehicleNumber: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  vin?: string;
}

// Appointment Types
export interface AppointmentResponse {
  id: string;
  customerId: string;
  date: string;
  time: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAppointmentRequest {
  customerId: string;
  date: string;
  time: string;
  status?: string;
}

// Sale Types
export enum PaymentMethod {
  Cash = "Cash",
  Credit = "Credit",
  Card = "Card"
}

export enum SaleStatus {
  Completed = "Completed",
  Pending = "Pending",
  Refunded = "Refunded"
}

export interface SaleItemResponse {
  id: string;
  partId: string;
  partName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface SaleResponse {
  id: string;
  customerId: string;
  customerName: string;
  staffId: string;
  saleDate: string;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  loyaltyDiscountApplied: boolean;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  notes?: string;
  createdAt: string;
  items: SaleItemResponse[];
}

// Part Request Types
export interface PartRequestResponse {
  id: string;
  customerId: string;
  partName: string;
  quantity: number;
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePartRequestRequest {
  customerId: string;
  partName: string;
  quantity: number;
  status?: string;
}

// Review Types
export interface ReviewResponse {
  id: string;
  customerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  customerId: string;
  rating: number;
  comment?: string;
}