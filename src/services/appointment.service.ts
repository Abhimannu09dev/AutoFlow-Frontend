import { apiClient, ApiError } from '../lib/api';
import type { AppointmentResponse, CreateAppointmentRequest } from '../types/api';

export class AppointmentService {
  static async createAppointment(appointmentData: CreateAppointmentRequest) {
    try {
      return await apiClient.post<AppointmentResponse>('/api/appointments', appointmentData);
    } catch (error) {
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as AppointmentResponse,
        errorType: apiError.errorType
      };
    }
  }

  static async getAllAppointments() {
    try {
      return await apiClient.get<AppointmentResponse[]>('/api/appointments');
    } catch (error) {
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: [] as AppointmentResponse[],
        errorType: apiError.errorType
      };
    }
  }

  static async getAppointmentById(id: string) {
    try {
      return await apiClient.get<AppointmentResponse>(`/api/appointments/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as AppointmentResponse,
        errorType: apiError.errorType
      };
    }
  }
}