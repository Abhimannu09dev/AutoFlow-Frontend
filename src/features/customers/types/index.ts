export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  membershipTier?: "standard" | "gold" | "premium";
}
