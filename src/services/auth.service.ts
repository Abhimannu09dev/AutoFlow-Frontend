import { apiClient, ApiError } from '../lib/api';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/api';

export class AuthService {
  static async login(credentials: LoginRequest) {
    try {
      console.log('AuthService: Making login request to /api/auth/login with:', credentials);
      
      // Make the API call to the Next.js API route
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      console.log('AuthService: Response status:', response.status);
      console.log('AuthService: Response ok:', response.ok);
      console.log('AuthService: Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('AuthService: Response data:', result);

      if (!response.ok || !(result?.IsSuccess || result?.isSuccess)) {
        console.log('AuthService: Login failed - response not ok or IsSuccess/isSuccess false');
        return {
          isSuccess: false,
          message: result?.Message || result?.message || 'Login failed',
          data: {} as AuthResponse,
          errorType: 'Unauthorized' as any
        };
      }

      const userData = result.Data || result.data;
      console.log('AuthService: User data extracted:', userData);
      
      if (userData && userData.token && typeof window !== 'undefined') {
        console.log('AuthService: Storing token in localStorage:', userData.token);
        
        // Store in both locations for compatibility
        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Store in the format expected by admin dashboard
        localStorage.setItem('autoflow_auth', JSON.stringify({
          token: userData.token,
          ...userData
        }));
        
        console.log('AuthService: Stored token and user data in localStorage');
        console.log('AuthService: Verification - token from localStorage:', localStorage.getItem('authToken'));
        console.log('AuthService: Verification - autoflow_auth from localStorage:', localStorage.getItem('autoflow_auth'));
      } else {
        console.log('AuthService: No token to store or not in browser environment');
        console.log('AuthService: userData:', userData);
        console.log('AuthService: userData.token:', userData?.token);
        console.log('AuthService: typeof window:', typeof window);
      }
      
      return {
        isSuccess: true,
        message: null,
        data: userData,
        errorType: 'None' as any
      };
    } catch (error) {
      console.error('AuthService: Login error caught:', error);
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message || 'Network error occurred',
        data: {} as AuthResponse,
        errorType: 'NetworkError' as any
      };
    }
  }

  static async register(userData: RegisterRequest) {
    try {
      // Make the API call to the Next.js API route for consistency
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok || !result?.IsSuccess) {
        return {
          isSuccess: false,
          message: result?.Message || result?.message || 'Registration failed',
          data: {} as AuthResponse,
          errorType: 'ValidationError' as any
        };
      }

      const authData = result.Data || result.data;
      
      if (authData && authData.token && typeof window !== 'undefined') {
        localStorage.setItem('authToken', authData.token);
        localStorage.setItem('user', JSON.stringify(authData));
      }
      
      return {
        isSuccess: true,
        message: null,
        data: authData,
        errorType: 'None' as any
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        isSuccess: false,
        message: apiError.message || 'Network error occurred',
        data: {} as AuthResponse,
        errorType: 'NetworkError' as any
      };
    }
  }

  static logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('autoflow_auth'); // Clear admin dashboard token storage
    }
  }

  static getCurrentUser(): AuthResponse | null {
    if (typeof window === 'undefined') return null;
    
    // Check both localStorage keys for compatibility
    let userStr = localStorage.getItem('user');
    if (!userStr) {
      userStr = localStorage.getItem('autoflow_auth');
    }
    
    if (!userStr) return null;
    
    try {
      const userData = JSON.parse(userStr);
      
      // Handle different response formats
      if (userData.token && userData.userId) {
        return userData;
      }
      
      // If it's wrapped in a different format, extract the user data
      if (userData.Data || userData.data) {
        return userData.Data || userData.data;
      }
      
      return userData;
    } catch {
      return null;
    }
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
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

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}