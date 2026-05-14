import { 
  ApiResponse, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  CustomerResponseDto,
  VehicleResponseDto,
  VehicleCreateDto,
  AppointmentResponse,
  CreateAppointmentRequest,
  SaleResponse,
  PartRequestResponse,
  CreatePartRequestRequest,
  ReviewResponse,
  CreateReviewRequest
} from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {

      throw error;
    }
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.isSuccess && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.isSuccess && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  logout(): void {
    this.removeToken();
  }

  // Customer Vehicles
  async getCustomerVehicles(customerId: string): Promise<ApiResponse<VehicleResponseDto[]>> {
    return this.request<VehicleResponseDto[]>(`/api/customers/${customerId}/vehicles`);
  }

  async addCustomerVehicle(customerId: string, vehicle: VehicleCreateDto): Promise<ApiResponse<VehicleResponseDto>> {
    return this.request<VehicleResponseDto>(`/api/customers/${customerId}/vehicles`, {
      method: 'POST',
      body: JSON.stringify(vehicle),
    });
  }

  // Appointments
  async createAppointment(appointment: CreateAppointmentRequest): Promise<ApiResponse<AppointmentResponse>> {
    return this.request<AppointmentResponse>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  }

  async getAppointments(): Promise<ApiResponse<AppointmentResponse[]>> {
    return this.request<AppointmentResponse[]>('/api/appointments');
  }

  async getAppointmentById(id: string): Promise<ApiResponse<AppointmentResponse>> {
    return this.request<AppointmentResponse>(`/api/appointments/${id}`);
  }

  // Customer Services (Appointments)
  async getCustomerServices(customerId: string): Promise<ApiResponse<AppointmentResponse[]>> {
    return this.request<AppointmentResponse[]>(`/api/customers/${customerId}/services`);
  }

  // Customer Purchases (Sales)
  async getCustomerPurchases(customerId: string): Promise<ApiResponse<SaleResponse[]>> {
    return this.request<SaleResponse[]>(`/api/customers/${customerId}/purchases`);
  }

  // Part Requests
  async createPartRequest(request: CreatePartRequestRequest): Promise<ApiResponse<PartRequestResponse>> {
    return this.request<PartRequestResponse>('/api/part-requests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getPartRequests(): Promise<ApiResponse<PartRequestResponse[]>> {
    return this.request<PartRequestResponse[]>('/api/part-requests');
  }

  // Reviews
  async createReview(review: CreateReviewRequest): Promise<ApiResponse<ReviewResponse>> {
    return this.request<ReviewResponse>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  async getReviews(): Promise<ApiResponse<ReviewResponse[]>> {
    return this.request<ReviewResponse[]>('/api/reviews');
  }

  // Customer Profile
  async getCustomerById(id: string): Promise<ApiResponse<CustomerResponseDto>> {
    return this.request<CustomerResponseDto>(`/api/customers/${id}`);
  }
}

export const apiService = new ApiService();
