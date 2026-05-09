import { apiClient, ApiError } from '../lib/api';
import type { 
  CustomerResponseDto, 
  VehicleResponseDto, 
  VehicleCreateDto,
  SaleResponse,
  AppointmentResponse,
  CreateAppointmentRequest,
  PartRequestResponse,
  CreatePartRequestRequest,
  ReviewResponse,
  CreateReviewRequest
} from '../types/api';

/**
 * Customer Profile Service - For customer-accessible endpoints
 * These endpoints allow customers to access their own data without admin permissions
 */
export class CustomerProfileService {
  
  // Get current customer's profile
  static async getProfile() {
    try {
      const response = await apiClient.get<CustomerResponseDto>('/api/customer/profile');
      return response;
    } catch (error) {
      console.error('Customer profile API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as CustomerResponseDto,
        errorType: apiError.errorType as any
      };
    }
  }

  // Update current customer's profile
  static async updateProfile(profileData: {
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
  }) {
    try {
      const response = await apiClient.put<CustomerResponseDto>('/api/customer/profile', profileData);
      return response;
    } catch (error) {
      console.error('Customer profile update API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as CustomerResponseDto,
        errorType: apiError.errorType as any
      };
    }
  }

  // Get current customer's vehicles
  static async getVehicles() {
    try {
      const response = await apiClient.get<VehicleResponseDto[]>('/api/customer/vehicles');
      return response;
    } catch (error) {
      console.error('Customer vehicles API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: [] as VehicleResponseDto[],
        errorType: apiError.errorType as any
      };
    }
  }

  // Add a vehicle to current customer's profile
  static async addVehicle(vehicleData: VehicleCreateDto) {
    try {
      const response = await apiClient.post<VehicleResponseDto>('/api/customer/vehicles', vehicleData);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as VehicleResponseDto,
        errorType: apiError.errorType as any
      };
    }
  }

  // Update a vehicle for current customer
  static async updateVehicle(vehicleId: string, vehicleData: Partial<VehicleCreateDto>) {
    try {
      const response = await apiClient.put<VehicleResponseDto>('/api/customer/vehicles', {
        id: vehicleId,
        ...vehicleData
      });
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as VehicleResponseDto,
        errorType: apiError.errorType as any
      };
    }
  }

  // Delete a vehicle for current customer
  static async deleteVehicle(vehicleId: string) {
    try {
      const response = await apiClient.delete<VehicleResponseDto>(`/api/customer/vehicles?id=${vehicleId}`);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as VehicleResponseDto,
        errorType: apiError.errorType as any
      };
    }
  }

  // Get current customer's purchase history
  static async getPurchases() {
    try {
      const response = await apiClient.get<SaleResponse[]>('/api/customer/purchases');
      return response;
    } catch (error) {
      console.error('Customer purchases API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: [] as SaleResponse[],
        errorType: apiError.errorType as any
      };
    }
  }

  // Get current customer's appointments
  static async getAppointments() {
    try {
      const response = await apiClient.get<AppointmentResponse[]>('/api/customer/appointments');
      return response;
    } catch (error) {
      console.error('Customer appointments API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: [] as AppointmentResponse[],
        errorType: apiError.errorType as any
      };
    }
  }

  // Create a new appointment for current customer
  static async createAppointment(appointmentData: CreateAppointmentRequest) {
    try {
      const response = await apiClient.post<AppointmentResponse>('/api/customer/appointments', appointmentData);
      return response;
    } catch (error) {
      console.error('Create appointment API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as AppointmentResponse,
        errorType: apiError.errorType as any
      };
    }
  }

  // Create a new part request for current customer
  static async createPartRequest(partRequestData: CreatePartRequestRequest) {
    try {
      const response = await apiClient.post<PartRequestResponse>('/api/customer/parts-requests', partRequestData);
      return response;
    } catch (error) {
      console.error('Create part request API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as PartRequestResponse,
        errorType: apiError.errorType as any
      };
    }
  }

  // Get current customer's parts requests
  static async getPartsRequests() {
    try {
      const response = await apiClient.get<PartRequestResponse[]>('/api/customer/parts-requests');
      return response;
    } catch (error) {
      console.error('Customer parts requests API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: [] as PartRequestResponse[],
        errorType: apiError.errorType as any
      };
    }
  }

  // Create a new review for current customer
  static async createReview(reviewData: CreateReviewRequest) {
    try {
      const response = await apiClient.post<ReviewResponse>('/api/customer/reviews', reviewData);
      return response;
    } catch (error) {
      console.error('Create review API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as ReviewResponse,
        errorType: apiError.errorType as any
      };
    }
  }

  // Get current customer's reviews
  static async getReviews() {
    try {
      const response = await apiClient.get<ReviewResponse[]>('/api/customer/reviews');
      return response;
    } catch (error) {
      console.error('Customer reviews API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: [] as ReviewResponse[],
        errorType: apiError.errorType as any
      };
    }
  }
}