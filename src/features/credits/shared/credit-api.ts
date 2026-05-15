"use client";

import { apiRequest, toDateLabel, toNumber } from "@/features/admin/components/shared/admin-api";

import type {
  CreditDetail,
  CreditLedgerCapabilities,
  CreditLedgerFetchMeta,
  CreditLedgerRow,
  CreditLedgerStatus,
  CreditPaymentHistoryItem,
  CreditStatusUpdateValue,
  RecordCreditPaymentPayload,
  RecordCreditPaymentResult,
  UpdateCreditStatusPayload,
  UpdateCreditStatusResult,
} from "./credit.types";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function readPath(record: UnknownRecord, key: string): unknown {
  if (key in record) return record[key];
  if (!key.includes(".")) return undefined;

  const parts = key.split(".");
  let current: unknown = record;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as UnknownRecord)[part];
  }
  return current;
}

function readFirst(record: UnknownRecord, keys: string[]): unknown {
  for (const key of keys) {
    const value = readPath(record, key);
    if (value != null) return value;
  }
  return undefined;
}

function readString(record: UnknownRecord, keys: string[], fallback = ""): string {
  const value = readFirst(record, keys);
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function readNumber(record: UnknownRecord, keys: string[], fallback = 0): number {
  return toNumber(readFirst(record, keys), fallback);
}

function readDateString(record: UnknownRecord, keys: string[]): string | undefined {
  const value = readFirst(record, keys);
  if (typeof value === "string" && value.length > 0) return value;
  return undefined;
}

function extractMessage(payload: unknown, fallback: string): string {
  const record = asRecord(payload);
  return readString(record, ["message", "Message"], fallback);
}

function isApiSuccess(payload: unknown): boolean {
  const record = asRecord(payload);
  const direct = readFirst(record, ["isSuccess", "IsSuccess"]);
  if (typeof direct === "boolean") return direct;
  return true;
}

export function unwrapArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== "object") return [];

  const obj = payload as UnknownRecord;
  if (Array.isArray(obj.data)) return obj.data as T[];
  if (Array.isArray(obj.items)) return obj.items as T[];
  if (Array.isArray(obj.records)) return obj.records as T[];

  if (obj.data && typeof obj.data === "object") {
    const dataObj = obj.data as UnknownRecord;
    if (Array.isArray(dataObj.items)) return dataObj.items as T[];
    if (Array.isArray(dataObj.records)) return dataObj.records as T[];
  }

  return [];
}

function addThirtyDays(dateValue?: string): string | undefined {
  if (!dateValue) return undefined;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return undefined;
  date.setDate(date.getDate() + 30);
  return date.toISOString();
}

function computeDaysOverdue(dueDate?: string): number {
  if (!dueDate) return 0;
  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) return 0;
  const now = new Date();
  const days = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

function normalizeDisplayStatus(
  rawStatus: string,
  paidAmount: number,
  remainingAmount: number,
  daysOverdue: number
): CreditLedgerStatus {
  if (remainingAmount <= 0) return "Paid";
  if (paidAmount > 0 && remainingAmount > 0) return "Partially Paid";
  if (remainingAmount > 0 && daysOverdue > 0) return "Overdue";

  const lowered = rawStatus.toLowerCase().replaceAll(" ", "");
  if (lowered.includes("partiallypaid")) return "Partially Paid";
  if (lowered.includes("cleared")) return "Paid";
  if (lowered.includes("paid") && !lowered.includes("partially")) return "Paid";
  if (lowered.includes("overdue")) return "Overdue";
  if (lowered.includes("outstanding") || lowered.includes("pending")) return "Pending";
  return "Pending";
}

function normalizeBackendStatus(rawStatus: string): CreditStatusUpdateValue {
  const lowered = rawStatus.toLowerCase().replaceAll(" ", "");
  if (lowered.includes("partiallypaid")) return "PartiallyPaid";
  if (lowered.includes("cleared")) return "Paid";
  if (lowered.includes("paid") && !lowered.includes("partially")) return "Paid";
  if (lowered.includes("overdue")) return "Overdue";
  return "Outstanding";
}

function formatStatus(status: CreditLedgerStatus): string {
  return status;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(value, 0));
}

export function formatDate(value?: string): string {
  return toDateLabel(value);
}

function escapeCsvCell(value: unknown): string {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function exportCreditCsv(filename: string, rows: CreditLedgerRow[]): void {
  const header = [
    "Customer Name",
    "Customer Email",
    "Customer Phone",
    "Sale ID",
    "Invoice Number",
    "Sale Date",
    "Due Date",
    "Total Credit Amount",
    "Paid Amount",
    "Remaining Amount",
    "Days Overdue",
    "Status",
  ];

  const body = rows.map((row) => [
    row.customerName,
    row.customerEmail,
    row.customerPhone,
    row.saleId,
    row.invoiceNumber,
    formatDate(row.saleDate),
    formatDate(row.dueDate),
    row.totalCreditAmount.toFixed(2),
    row.paidAmount.toFixed(2),
    row.remainingAmount.toFixed(2),
    row.daysOverdue,
    row.status,
  ]);

  const csv = [header, ...body].map((line) => line.map(escapeCsvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface PrintableOptions {
  filterSummary: string;
  generatedAt: string;
  totals: {
    totalCreditAmount: number;
    totalPaidAmount: number;
    totalRemainingAmount: number;
  };
}

export function exportCreditPrintable(rows: CreditLedgerRow[], options: PrintableOptions): void {
  const escapeHtml = (value: string): string =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const htmlRows = rows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.customerName)}</td>
          <td>${escapeHtml(row.customerEmail)}</td>
          <td>${escapeHtml(row.saleId)}</td>
          <td>${escapeHtml(row.invoiceNumber)}</td>
          <td>${escapeHtml(formatDate(row.saleDate))}</td>
          <td>${escapeHtml(formatDate(row.dueDate))}</td>
          <td style="text-align:right">${escapeHtml(formatCurrency(row.totalCreditAmount))}</td>
          <td style="text-align:right">${escapeHtml(formatCurrency(row.paidAmount))}</td>
          <td style="text-align:right">${escapeHtml(formatCurrency(row.remainingAmount))}</td>
          <td style="text-align:right">${row.daysOverdue}</td>
          <td>${escapeHtml(formatStatus(row.status))}</td>
        </tr>
      `
    )
    .join("");

  const html = `
    <html>
      <head>
        <title>AutoFlow Credit Ledger</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
          h1 { margin: 0 0 8px 0; font-size: 24px; }
          p { margin: 4px 0; font-size: 12px; color: #374151; }
          table { border-collapse: collapse; width: 100%; margin-top: 12px; }
          th, td { border: 1px solid #d1d5db; padding: 8px; font-size: 12px; text-align: left; }
          th { background: #f3f4f6; }
          .totals { margin-top: 12px; display: flex; gap: 16px; font-size: 12px; }
          .totals span strong { color: #111827; }
        </style>
      </head>
      <body>
        <h1>Credit Ledger</h1>
        <p>Generated: ${escapeHtml(options.generatedAt)}</p>
        <p>Filters: ${escapeHtml(options.filterSummary)}</p>
        <div class="totals">
          <span><strong>Total Credit:</strong> ${escapeHtml(formatCurrency(options.totals.totalCreditAmount))}</span>
          <span><strong>Total Paid:</strong> ${escapeHtml(formatCurrency(options.totals.totalPaidAmount))}</span>
          <span><strong>Total Remaining:</strong> ${escapeHtml(formatCurrency(options.totals.totalRemainingAmount))}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Sale ID</th>
              <th>Invoice #</th>
              <th>Sale Date</th>
              <th>Due Date</th>
              <th>Total Credit</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Days Overdue</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${htmlRows}</tbody>
        </table>
      </body>
    </html>
  `;

  const win = window.open("", "_blank", "noopener,noreferrer,width=1200,height=800");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

export function getCreditLedgerCapabilities(): CreditLedgerCapabilities {
  return {
    hasCreditDetailsApi: true,
    hasCreditPaymentApi: true,
    hasCreditStatusApi: true,
    hasCreditReminderApi: true,
  };
}

async function enrichRowsWithCreditDetails(rows: CreditLedgerRow[]): Promise<CreditLedgerRow[]> {
  if (rows.length === 0) return rows;

  const uniqueSaleIds = [...new Set(rows.map((row) => row.saleId).filter((saleId) => saleId.length > 0))];
  if (uniqueSaleIds.length === 0) return rows;

  const detailResults = await Promise.all(
    uniqueSaleIds.map(async (saleId) => {
      const result = await fetchCreditDetail(saleId);
      return [saleId, result.detail] as const;
    })
  );

  const detailBySaleId = new Map<string, CreditDetail>();
  detailResults.forEach(([saleId, detail]) => {
    if (detail) {
      detailBySaleId.set(saleId, detail);
    }
  });

  return rows.map((row) => {
    const detail = detailBySaleId.get(row.saleId);
    if (!detail) return row;

    return {
      ...row,
      invoiceNumber: detail.invoiceNumber || row.invoiceNumber,
      customerId: detail.customerId || row.customerId,
      customerName: detail.customerName || row.customerName,
      customerEmail: detail.customerEmail || row.customerEmail,
      customerPhone: detail.customerPhone || row.customerPhone,
      saleDate: detail.saleDate || row.saleDate,
      dueDate: detail.dueDate || row.dueDate,
      totalCreditAmount: Number.isFinite(detail.totalCreditAmount) ? detail.totalCreditAmount : row.totalCreditAmount,
      paidAmount: Number.isFinite(detail.paidAmount) ? detail.paidAmount : row.paidAmount,
      remainingAmount: Number.isFinite(detail.remainingAmount) ? detail.remainingAmount : row.remainingAmount,
      daysOverdue: Number.isFinite(detail.daysOverdue) ? detail.daysOverdue : row.daysOverdue,
      status: detail.status,
      backendStatus: detail.backendStatus,
      settlementEstimated: false,
    } satisfies CreditLedgerRow;
  });
}

function mapSaleRecordToCreditRow(saleRaw: unknown, index: number): CreditLedgerRow | null {
  const sale = asRecord(saleRaw);
  const saleId = readString(sale, ["id", "Id"]);
  if (!saleId) return null;

  const paymentMethod = readString(sale, ["paymentMethod", "PaymentMethod"]).toLowerCase();
  if (paymentMethod !== "credit") return null;

  const saleDate = readString(sale, ["saleDate", "SaleDate"]) || readString(sale, ["createdAt", "CreatedAt"]);
  const dueDate = addThirtyDays(saleDate);
  const totalCreditAmount = readNumber(sale, ["totalAmount", "TotalAmount"], 0);
  const paidAmount = 0;
  const remainingAmount = Math.max(0, totalCreditAmount);
  const daysOverdue = computeDaysOverdue(dueDate);
  const status: CreditLedgerStatus = daysOverdue > 0 ? "Overdue" : "Pending";

  return {
    rowId: `${saleId}-sales-fallback-${index}`,
    saleId,
    invoiceNumber: readString(sale, ["invoiceNumber", "InvoiceNumber"], "-"),
    customerId: readString(sale, ["customerId", "CustomerId"]),
    customerName: readString(
      sale,
      ["customerName", "CustomerName", "customer.fullName", "Customer.FullName", "fullName", "FullName"],
      "Unknown Customer"
    ),
    customerEmail: readString(
      sale,
      ["customerEmail", "CustomerEmail", "invoiceEmail", "InvoiceEmail", "customer.email", "Customer.Email", "email", "Email"],
      "-"
    ),
    customerPhone: readString(sale, ["customerPhone", "CustomerPhone", "customer.phone", "Customer.Phone", "phone", "Phone"], "-"),
    saleDate: saleDate || undefined,
    dueDate: dueDate || undefined,
    totalCreditAmount,
    paidAmount,
    remainingAmount,
    daysOverdue,
    status,
    backendStatus: "Outstanding",
    paymentMethod: readString(sale, ["paymentMethod", "PaymentMethod"]),
    settlementEstimated: true,
  };
}

export async function fetchCreditLedgerRows(): Promise<{
  rows: CreditLedgerRow[];
  error: string | null;
  meta: CreditLedgerFetchMeta;
}> {
  const salesResult = await apiRequest<unknown>("/api/sales?page=1&pageSize=1000");

  if (salesResult.error) {
    return {
      rows: [],
      error: salesResult.error,
      meta: {
        pendingEndpointRowCount: 0,
        salesCreditRowCount: 0,
        usedSalesFallback: false,
      },
    };
  }

  const salesRows = salesResult.error ? [] : unwrapArray<unknown>(salesResult.data);
  const salesCreditRows = salesRows
    .map((saleRaw, index) => mapSaleRecordToCreditRow(saleRaw, index))
    .filter((row): row is CreditLedgerRow => row !== null);

  const enrichedRows = await enrichRowsWithCreditDetails(salesCreditRows);

  return {
    rows: enrichedRows,
    error: null,
    meta: {
      pendingEndpointRowCount: 0,
      salesCreditRowCount: salesCreditRows.length,
      usedSalesFallback: false,
    },
  };
}

function mapCreditDetail(payload: unknown): CreditDetail | null {
  const record = asRecord(payload);
  const saleId = readString(record, ["saleId", "SaleId"]);
  if (!saleId) return null;

  const paidAmount = readNumber(record, ["paidAmount", "PaidAmount"], 0);
  const remainingAmount = readNumber(record, ["remainingAmount", "RemainingAmount"], 0);
  const daysOverdue = readNumber(record, ["daysOverdue", "DaysOverdue"], 0);
  const backendStatusRaw = readString(record, ["status", "Status"], "Outstanding");
  const backendStatus = normalizeBackendStatus(backendStatusRaw);

  const paymentHistoryRaw = unwrapArray<unknown>(readFirst(record, ["paymentHistory", "PaymentHistory"]));
  const paymentHistory: CreditPaymentHistoryItem[] = paymentHistoryRaw.map((itemRaw, index) => {
    const item = asRecord(itemRaw);
    return {
      paymentId: readString(item, ["paymentId", "PaymentId", "id", "Id"], `payment-${index}`),
      amount: readNumber(item, ["amount", "Amount"], 0),
      paymentDate: readString(item, ["paymentDate", "PaymentDate"]),
      paymentMethod: readString(item, ["paymentMethod", "PaymentMethod"], "-"),
      note: readString(item, ["note", "Note"]),
    };
  });

  return {
    saleId,
    invoiceNumber: readString(record, ["invoiceNumber", "InvoiceNumber"], "-"),
    customerId: readString(record, ["customerId", "CustomerId"]),
    customerName: readString(record, ["customerName", "CustomerName"], "Unknown Customer"),
    customerEmail: readString(record, ["customerEmail", "CustomerEmail"], "-"),
    customerPhone: readString(record, ["customerPhone", "CustomerPhone"], "-"),
    saleDate: readDateString(record, ["saleDate", "SaleDate"]),
    dueDate: readDateString(record, ["dueDate", "DueDate"]),
    totalCreditAmount: readNumber(record, ["totalCreditAmount", "TotalCreditAmount"], 0),
    paidAmount,
    remainingAmount,
    daysOverdue,
    status: normalizeDisplayStatus(backendStatusRaw, paidAmount, remainingAmount, daysOverdue),
    backendStatus,
    paymentHistory,
  };
}

export async function fetchCreditDetail(saleId: string): Promise<{ detail: CreditDetail | null; error: string | null }> {
  const response = await apiRequest<unknown>(`/api/credits/${saleId}`);
  if (response.error) {
    return { detail: null, error: response.error };
  }

  const detail = mapCreditDetail(response.data);
  if (!detail) {
    return { detail: null, error: "Credit detail response was empty." };
  }

  return { detail, error: null };
}

export async function recordCreditPayment(
  saleId: string,
  payload: RecordCreditPaymentPayload
): Promise<{ success: boolean; message: string; data: RecordCreditPaymentResult | null }> {
  const response = await apiRequest<unknown>(`/api/credits/${saleId}/payments`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (response.error) {
    return { success: false, message: response.error, data: null };
  }

  const data = asRecord(response.data);
  const message = extractMessage(response.data, "Credit payment recorded successfully.");
  if (!isApiSuccess(response.data)) {
    return { success: false, message, data: null };
  }

  return {
    success: true,
    message,
    data: {
      saleId: readString(data, ["saleId", "SaleId"]),
      totalCreditAmount: readNumber(data, ["totalCreditAmount", "TotalCreditAmount"], 0),
      paidAmount: readNumber(data, ["paidAmount", "PaidAmount"], 0),
      remainingAmount: readNumber(data, ["remainingAmount", "RemainingAmount"], 0),
      status: normalizeBackendStatus(readString(data, ["status", "Status"], "Outstanding")),
      updatedAt: readString(data, ["updatedAt", "UpdatedAt"]),
    },
  };
}

export async function updateCreditStatus(
  saleId: string,
  payload: UpdateCreditStatusPayload
): Promise<{ success: boolean; message: string; data: UpdateCreditStatusResult | null }> {
  const response = await apiRequest<unknown>(`/api/credits/${saleId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (response.error) {
    return { success: false, message: response.error, data: null };
  }

  const data = asRecord(response.data);
  const message = extractMessage(response.data, "Credit status updated successfully.");
  if (!isApiSuccess(response.data)) {
    return { success: false, message, data: null };
  }

  return {
    success: true,
    message,
    data: {
      saleId: readString(data, ["saleId", "SaleId"]),
      status: normalizeBackendStatus(readString(data, ["status", "Status"], payload.status)),
      updatedAt: readString(data, ["updatedAt", "UpdatedAt"]),
    },
  };
}

export async function sendCreditReminder(saleId: string): Promise<{ success: boolean; message: string }> {
  const response = await apiRequest<unknown>(`/api/credits/${saleId}/send-reminder`, { method: "POST" });
  if (response.error) return { success: false, message: response.error };
  return {
    success: true,
    message: extractMessage(response.data, "Credit reminder sent successfully."),
  };
}
