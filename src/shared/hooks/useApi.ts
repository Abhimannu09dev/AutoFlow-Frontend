"use client";

import { useCallback, useEffect, useState } from 'react';
import { CustomerService } from '../../services/customer.service';
import { useAuth } from '../../contexts/AuthContext';
import { 
  VehicleResponseDto, 
  AppointmentResponse, 
  SaleResponse, 
  CustomerResponseDto
} from '../../types/api';

// Generic hook for API calls
export function useApiCall<T>(
  apiCall: () => Promise<{ isSuccess: boolean; data: T }>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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
  }, [apiCall]);

  useEffect(() => {
    void Promise.resolve().then(fetchData);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Customer Vehicles Hook
export function useCustomerVehicles() {
  const { user } = useAuth();
  const customerId = user?.id ?? '';
  const loadCustomerVehicles = useCallback(
    () => CustomerService.getCustomerVehicles(customerId),
    [customerId]
  );
  
  return useApiCall<VehicleResponseDto[]>(loadCustomerVehicles);
}

// Customer Services Hook
export function useCustomerServices() {
  const { user } = useAuth();
  const customerId = user?.id ?? '';
  const loadCustomerServices = useCallback(
    () => CustomerService.getCustomerServices(customerId),
    [customerId]
  );
  
  return useApiCall<AppointmentResponse[]>(loadCustomerServices);
}

// Customer Purchases Hook
export function useCustomerPurchases() {
  const { user } = useAuth();
  const customerId = user?.id ?? '';
  const loadCustomerPurchases = useCallback(
    () => CustomerService.getCustomerPurchases(customerId),
    [customerId]
  );
  
  return useApiCall<SaleResponse[]>(loadCustomerPurchases);
}

// Customer Profile Hook
export function useCustomerProfile() {
  const { user } = useAuth();
  const customerId = user?.id ?? '';
  const loadCustomerProfile = useCallback(
    () => CustomerService.getCustomerById(customerId),
    [customerId]
  );
  
  return useApiCall<CustomerResponseDto>(loadCustomerProfile);
}
