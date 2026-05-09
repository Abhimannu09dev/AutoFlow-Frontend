import { useState, useEffect } from 'react';
import { CustomerService } from '../services/customer.service';
import { CustomerProfileService } from '../services/customerProfile.service';
import { useAuth } from '../contexts/AuthContext';
import type { 
  CustomerResponseDto, 
  VehicleResponseDto, 
  SaleResponse, 
  AppointmentResponse
} from '../types/api';

export function useCustomerData() {
  const { user } = useAuth();
  const [customer, setCustomer] = useState<CustomerResponseDto | null>(null);
  const [vehicles, setVehicles] = useState<VehicleResponseDto[]>([]);
  const [purchases, setPurchases] = useState<SaleResponse[]>([]);
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchCustomerData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Always use customer-specific endpoints for customers
        if (user.role === 'customer') {
          // Use customer profile service for customer-accessible endpoints
          const [profileResponse, vehiclesResponse, purchasesResponse, appointmentsResponse] = await Promise.all([
            CustomerProfileService.getProfile(),
            CustomerProfileService.getVehicles(),
            CustomerProfileService.getPurchases(),
            CustomerProfileService.getAppointments(),
          ]);

          if (profileResponse.isSuccess) {
            setCustomer(profileResponse.data);
          } else {
            // Fallback to user data if profile API fails
            const customerData: CustomerResponseDto = {
              id: user.id,
              fullName: user.name,
              email: user.email,
              phone: '',
              address: '',
              createdAt: new Date().toISOString(),
              applicationUserId: user.id
            };
            setCustomer(customerData);
          }

          if (vehiclesResponse.isSuccess) {
            setVehicles(vehiclesResponse.data);
          }

          if (purchasesResponse.isSuccess) {
            setPurchases(purchasesResponse.data);
          }

          if (appointmentsResponse.isSuccess) {
            setAppointments(appointmentsResponse.data);
          }
          
        } else {
          // For admin/staff, try to fetch actual data but provide fallback
          try {
            const customerResponse = await CustomerService.getCustomerById(user.id);
            if (customerResponse.isSuccess) {
              setCustomer(customerResponse.data);
            }

            const vehiclesResponse = await CustomerService.getCustomerVehicles(user.id);
            if (vehiclesResponse.isSuccess) {
              setVehicles(vehiclesResponse.data);
            }

            const purchasesResponse = await CustomerService.getCustomerPurchases(user.id);
            if (purchasesResponse.isSuccess) {
              setPurchases(purchasesResponse.data);
            }

            const servicesResponse = await CustomerService.getCustomerServices(user.id);
            if (servicesResponse.isSuccess) {
              setAppointments(servicesResponse.data);
            }
          } catch (apiError) {
            console.warn('API calls failed for admin/staff user, using fallback data');
            // Even for admin/staff, provide fallback if API fails
            const fallbackCustomer: CustomerResponseDto = {
              id: user.id,
              fullName: user.name,
              email: user.email,
              phone: '',
              address: '',
              createdAt: new Date().toISOString(),
              applicationUserId: user.id
            };
            setCustomer(fallbackCustomer);
          }
        }

      } catch (err) {
        console.error('Customer data fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch customer data');
        
        // Always provide fallback data even on error
        const fallbackCustomer: CustomerResponseDto = {
          id: user.id,
          fullName: user.name,
          email: user.email,
          phone: '',
          address: '',
          createdAt: new Date().toISOString(),
          applicationUserId: user.id
        };
        setCustomer(fallbackCustomer);
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [user?.id, user?.role, user?.name, user?.email]);

  const refetchData = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      if (user.role === 'customer') {
        // Use customer profile service for customers
        const [profileResponse, vehiclesResponse, purchasesResponse, appointmentsResponse] = await Promise.all([
          CustomerProfileService.getProfile(),
          CustomerProfileService.getVehicles(),
          CustomerProfileService.getPurchases(),
          CustomerProfileService.getAppointments(),
        ]);

        if (profileResponse.isSuccess) setCustomer(profileResponse.data);
        if (vehiclesResponse.isSuccess) setVehicles(vehiclesResponse.data);
        if (purchasesResponse.isSuccess) setPurchases(purchasesResponse.data);
        if (appointmentsResponse.isSuccess) setAppointments(appointmentsResponse.data);
      } else {
        // Use admin service for admin/staff
        const [customerResponse, vehiclesResponse, purchasesResponse, servicesResponse] = await Promise.all([
          CustomerService.getCustomerById(user.id),
          CustomerService.getCustomerVehicles(user.id),
          CustomerService.getCustomerPurchases(user.id),
          CustomerService.getCustomerServices(user.id),
        ]);

        if (customerResponse.isSuccess) setCustomer(customerResponse.data);
        if (vehiclesResponse.isSuccess) setVehicles(vehiclesResponse.data);
        if (purchasesResponse.isSuccess) setPurchases(purchasesResponse.data);
        if (servicesResponse.isSuccess) setAppointments(servicesResponse.data);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    customer,
    vehicles,
    purchases,
    appointments,
    isLoading,
    error,
    refetchData,
  };
}