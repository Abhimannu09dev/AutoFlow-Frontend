export type UserRole = "customer" | "staff" | "admin";

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}
