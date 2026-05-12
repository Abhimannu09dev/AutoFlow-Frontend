"use client";

import { useState, useEffect } from 'react';
import { CustomerService } from '../../services/customer.service';
import { useAuth } from '../../contexts/AuthContext';
import { 
  VehicleResponseDto, 
  AppointmentResponse, 
  SaleResponse, 
  PartRequestResponse,
  ReviewResponse,
  CustomerResponseDto
} from '../../types/api';

// Generic hook for API calls
export function useApiCall<T>(
  apiCall: () => Promise<{ isSuccess: boolean; data: T }>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      
      if (response.isSuccess) {
        setData(response.data);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// Customer Vehicles Hook
export function useCustomerVehicles() {
  const { user } = useAuth();
  
  return useApiCall<VehicleResponseDto[]>(
    () => CustomerService.getCustomerVehicles(user?.id || ''),
    [user?.id]
  );
}

// Customer Services Hook
export function useCustomerServices() {
  const { user } = useAuth();
  
  return useApiCall<AppointmentResponse[]>(
    () => CustomerService.getCustomerServices(user?.id || ''),
    [user?.id]
  );
}

// Customer Purchases Hook
export function useCustomerPurchases() {
  const { user } = useAuth();
  
  return useApiCall<SaleResponse[]>(
    () => CustomerService.getCustomerPurchases(user?.id || ''),
    [user?.id]
  );
}

// Customer Profile Hook
export function useCustomerProfile() {
  const { user } = useAuth();
  
  return useApiCall<CustomerResponseDto>(
    () => CustomerService.getCustomerById(user?.id || ''),
    [user?.id]
  );
}