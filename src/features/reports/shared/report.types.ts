export type CustomerReportTabKey = "top-spenders" | "regular-customers" | "pending-credit";

export type SortDirection = "asc" | "desc";

export type TopSpenderReportRow = {
  rowId: string;
  customerId?: string;
  customerName: string;
  email: string;
  phone: string;
  purchaseCount: number;
  totalSpent: number;
  lastPurchaseDate?: string;
};

export type RegularCustomerReportRow = {
  rowId: string;
  customerId?: string;
  customerName: string;
  email: string;
  phone: string;
  purchaseCount: number;
  totalSpent: number;
  lastPurchaseDate?: string;
};

export type PendingCreditReportRow = {
  rowId: string;
  saleId: string;
  customerId?: string;
  customerName: string;
  email: string;
  phone: string;
  saleDate?: string;
  creditAmount: number;
  daysOverdue: number;
};

export type CustomerReportRow = TopSpenderReportRow | RegularCustomerReportRow | PendingCreditReportRow;

export type CommonSortKey = "customerName" | "email" | "phone";

export type TopSpenderSortKey = CommonSortKey | "purchaseCount" | "totalSpent" | "lastPurchaseDate";
export type RegularCustomerSortKey = CommonSortKey | "purchaseCount" | "totalSpent" | "lastPurchaseDate";
export type PendingCreditSortKey =
  | "saleId"
  | CommonSortKey
  | "saleDate"
  | "creditAmount"
  | "daysOverdue";

export type TopSpenderSortState = {
  key: TopSpenderSortKey;
  direction: SortDirection;
};

export type RegularCustomerSortState = {
  key: RegularCustomerSortKey;
  direction: SortDirection;
};

export type PendingCreditSortState = {
  key: PendingCreditSortKey;
  direction: SortDirection;
};

export type ReportSummary = {
  countLabel: string;
  totalRows: number;
};

export type ReportRole = "admin" | "staff";
