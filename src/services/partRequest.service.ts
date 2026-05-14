import { apiClient, ApiError } from '../lib/api';
import type { CreatePartRequestRequest, PartRequestResponse } from '../types/api';

export class PartRequestService {
  static async createPartRequest(requestData: CreatePartRequestRequest) {
    try {
      return await apiClient.post<PartRequestResponse>('/api/part-requests', requestData);
    } catch (error) {
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as PartRequestResponse,
        errorType: apiError.errorType as any
      };
    }
  }

  static async getAllPartRequests() {
    try {
      return await apiClient.get<PartRequestResponse[]>('/api/part-requests');
    } catch (error) {
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: [] as PartRequestResponse[],
        errorType: apiError.errorType as any
      };
    }
  }
}
