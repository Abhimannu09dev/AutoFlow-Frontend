export type CreditLedgerRole = "admin" | "staff";

export type CreditLedgerStatus = "Pending" | "Partially Paid" | "Paid" | "Overdue";
export type CreditStatusUpdateValue = "Outstanding" | "PartiallyPaid" | "Paid" | "Overdue";
export type CreditPaymentMethod = "Cash" | "Card" | "Credit";

export type CreditLedgerRow = {
  rowId: string;
  saleId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  saleDate?: string;
  dueDate?: string;
  totalCreditAmount: number;
  paidAmount: number;
  remainingAmount: number;
  daysOverdue: number;
  status: CreditLedgerStatus;
  backendStatus?: CreditStatusUpdateValue;
  paymentMethod?: string;
  settlementEstimated?: boolean;
};

export type CreditPaymentHistoryItem = {
  paymentId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  note?: string;
};

export type CreditDetail = {
  saleId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  saleDate?: string;
  dueDate?: string;
  totalCreditAmount: number;
  paidAmount: number;
  remainingAmount: number;
  daysOverdue: number;
  status: CreditLedgerStatus;
  backendStatus: CreditStatusUpdateValue;
  paymentHistory: CreditPaymentHistoryItem[];
};

export type RecordCreditPaymentPayload = {
  amount: number;
  paymentDate: string;
  paymentMethod: CreditPaymentMethod;
  note?: string;
};

export type RecordCreditPaymentResult = {
  saleId: string;
  totalCreditAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: CreditStatusUpdateValue;
  updatedAt: string;
};

export type UpdateCreditStatusPayload = {
  status: CreditStatusUpdateValue;
};

export type UpdateCreditStatusResult = {
  saleId: string;
  status: CreditStatusUpdateValue;
  updatedAt: string;
};

export type CreditLedgerFilters = {
  search: string;
  status: "all" | "pending" | "partially-paid" | "paid" | "overdue";
  saleDateFrom: string;
  saleDateTo: string;
  dueDateFrom: string;
  dueDateTo: string;
  overdueOnly: boolean;
  outstandingOnly: boolean;
};

export type CreditLedgerSortKey =
  | "customerName"
  | "saleId"
  | "saleDate"
  | "dueDate"
  | "totalCreditAmount"
  | "paidAmount"
  | "remainingAmount"
  | "daysOverdue"
  | "status";

export type CreditLedgerSortState = {
  key: CreditLedgerSortKey;
  direction: "asc" | "desc";
};

export type CreditLedgerCapabilities = {
  hasCreditDetailsApi: boolean;
  hasCreditPaymentApi: boolean;
  hasCreditStatusApi: boolean;
  hasCreditReminderApi: boolean;
};

export type CreditLedgerFetchMeta = {
  pendingEndpointRowCount: number;
  salesCreditRowCount: number;
  usedSalesFallback: boolean;
};
