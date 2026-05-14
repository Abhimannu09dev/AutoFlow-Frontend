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

export class CustomerService {
  static async getCustomerById(id: string) {
    try {
      const response = await apiClient.get<CustomerResponseDto>(`/api/customers/${id}`);
      return response;
    } catch (error) {
      console.error('Customer API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as CustomerResponseDto,
        errorType: apiError.errorType
      };
    }
  }

  static async updateCustomer(id: string, customerData: Partial<CustomerResponseDto>) {
    try {
      const response = await apiClient.put<CustomerResponseDto>(`/api/customers/${id}`, customerData);
      return response;
    } catch (error) {
      console.error('Update customer API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as CustomerResponseDto,
        errorType: apiError.errorType
      };
    }
  }

  static async getCustomerVehicles(customerId: string) {
    try {
      const response = await apiClient.get<VehicleResponseDto[]>(`/api/customers/${customerId}/vehicles`);
      return response;
    } catch (error) {
      console.error('Vehicles API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: [] as VehicleResponseDto[],
        errorType: apiError.errorType
      };
    }
  }

  static async addVehicle(customerId: string, vehicleData: VehicleCreateDto) {
    try {
      const response = await apiClient.post<VehicleResponseDto>(`/api/customers/${customerId}/vehicles`, vehicleData);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as VehicleResponseDto,
        errorType: apiError.errorType
      };
    }
  }

  static async getCustomerPurchases(customerId: string) {
    try {
      const response = await apiClient.get<SaleResponse[]>(`/api/customers/${customerId}/purchases`);
      return response;
    } catch (error) {
      console.error('Purchases API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: [] as SaleResponse[],
        errorType: apiError.errorType
      };
    }
  }

  static async getCustomerServices(customerId: string) {
    try {
      const response = await apiClient.get<AppointmentResponse[]>(`/api/customers/${customerId}/services`);
      return response;
    } catch (error) {
      console.error('Services API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: [] as AppointmentResponse[],
        errorType: apiError.errorType
      };
    }
  }

  // Appointment methods
  static async getCustomerAppointments(customerId: string) {
    try {
      const response = await apiClient.get<AppointmentResponse[]>(`/api/customers/${customerId}/appointments`);
      return response;
    } catch (error) {
      console.error('Customer appointments API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: [] as AppointmentResponse[],
        errorType: apiError.errorType
      };
    }
  }

  static async createAppointment(customerId: string, appointmentData: CreateAppointmentRequest) {
    try {
      const response = await apiClient.post<AppointmentResponse>(`/api/customers/${customerId}/appointments`, appointmentData);
      return response;
    } catch (error) {
      console.error('Create appointment API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as AppointmentResponse,
        errorType: apiError.errorType
      };
    }
  }

  // Parts request methods
  static async getCustomerPartRequests(customerId: string) {
    try {
      const response = await apiClient.get<PartRequestResponse[]>(`/api/customers/${customerId}/parts-requests`);
      return response;
    } catch (error) {
      console.error('Customer parts requests API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: [] as PartRequestResponse[],
        errorType: apiError.errorType
      };
    }
  }

  static async createPartRequest(customerId: string, partRequestData: CreatePartRequestRequest) {
    try {
      const response = await apiClient.post<PartRequestResponse>(`/api/customers/${customerId}/parts-requests`, partRequestData);
      return response;
    } catch (error) {
      console.error('Create parts request API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as PartRequestResponse,
        errorType: apiError.errorType
      };
    }
  }

  // Review methods
  static async getCustomerReviews(customerId: string) {
    try {
      const response = await apiClient.get<ReviewResponse[]>(`/api/customers/${customerId}/reviews`);
      return response;
    } catch (error) {
      console.error('Customer reviews API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: [] as ReviewResponse[],
        errorType: apiError.errorType
      };
    }
  }

  static async createReview(customerId: string, reviewData: CreateReviewRequest) {
    try {
      const response = await apiClient.post<ReviewResponse>(`/api/customers/${customerId}/reviews`, reviewData);
      return response;
    } catch (error) {
      console.error('Create review API error:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as ReviewResponse,
        errorType: apiError.errorType
      };
    }
  }

  static async searchCustomers(query: string) {
    try {
      const response = await apiClient.get<CustomerResponseDto[]>(`/api/customers/search?query=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: [] as CustomerResponseDto[],
        errorType: apiError.errorType
      };
    }
  }
}