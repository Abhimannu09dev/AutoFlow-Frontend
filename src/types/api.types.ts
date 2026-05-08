export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
  status: true;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  status: false;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
