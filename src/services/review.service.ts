import { apiClient, ApiError } from '../lib/api';
import type { CreateReviewRequest, ReviewResponse } from '../types/api';

export class ReviewService {
  static async createReview(reviewData: CreateReviewRequest) {
    try {
      return await apiClient.post<ReviewResponse>('/api/reviews', reviewData);
    } catch (error) {
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message,
        data: {} as ReviewResponse,
        errorType: apiError.errorType as any
      };
    }
  }

  static async getAllReviews() {
    try {
      return await apiClient.get<ReviewResponse[]>('/api/reviews');
    } catch (error) {
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