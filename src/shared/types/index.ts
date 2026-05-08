export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  status?: boolean;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
