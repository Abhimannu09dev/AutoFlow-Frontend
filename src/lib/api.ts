const API_BASE_URL = ''; // Use relative URLs to hit Next.js API routes

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string | null;
  data: T;
  errorType: 'None' | 'NotFound' | 'ValidationError' | 'Conflict' | 'Unauthorized';
}

export interface ApiError {
  message: string;
  status: number;
  errorType: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    
    // First check the standard location
    let token = localStorage.getItem('authToken');
    
    // If not found, check the admin dashboard location
    if (!token) {
      const autoflowAuth = localStorage.getItem('autoflow_auth');
      if (autoflowAuth) {
        try {
          const parsed = JSON.parse(autoflowAuth);
          token = parsed.token;
        } catch {
          // Ignore parsing errors
        }
      }
    }
    
    return token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text.trim()) {
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            data = { error: 'Invalid JSON response', rawText: text };
          }
        } else {
          data = { error: 'Empty response body' };
        }
      } else {
        data = await response.text();
      }

      // Handle the specific API response format you're getting
      if (typeof data === 'object' && data !== null) {
        // Check for the format: {"IsSuccess": false, "Message": "...", "Data": null, "ErrorType": 0}
        if ('IsSuccess' in data) {
          return {
            isSuccess: data.IsSuccess,
            message: data.Message,
            data: data.Data,
            errorType: this.mapErrorType(data.ErrorType)
          };
        }
        
        // Check for the format: {"isSuccess": false, "message": "...", "data": null, "errorType": "..."}
        if ('isSuccess' in data) {
          return data;
        }
      }

      if (!response.ok) {
        // Handle different error status codes
        const errorMessage = typeof data === 'object' && (data.message || data.Message)
          ? (data.message || data.Message)
          : `HTTP error! status: ${response.status}`;
        
        const apiError: ApiError = {
          message: errorMessage,
          status: response.status,
          errorType: this.getErrorType(response.status)
        };
        
        throw apiError;
      }

      // Otherwise, wrap the data in ApiResponse format
      return {
        isSuccess: true,
        message: null,
        data: data,
        errorType: 'None'
      };

    } catch (error) {
      // If it's already an ApiError, re-throw it
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError: ApiError = {
          message: 'Backend service is not available',
          status: 0,
          errorType: 'NetworkError'
        };
        throw networkError;
      }
      
      const networkError: ApiError = {
        message: error instanceof Error ? error.message : 'Network error occurred',
        status: 0,
        errorType: 'NetworkError'
      };
      
      throw networkError;
    }
  }

  private mapErrorType(errorType: number): 'None' | 'NotFound' | 'ValidationError' | 'Conflict' | 'Unauthorized' {
    switch (errorType) {
      case 0:
        return 'None';
      case 1:
        return 'ValidationError';
      case 2:
        return 'NotFound';
      case 3:
        return 'Unauthorized';
      case 4:
        return 'Conflict';
      default:
        return 'None';
    }
  }



  private getErrorType(status: number): string {
    switch (status) {
      case 400:
        return 'ValidationError';
      case 401:
        return 'Unauthorized';
      case 404:
        return 'NotFound';
      case 409:
        return 'Conflict';
      default:
        return 'ServerError';
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
