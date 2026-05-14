"use client";

import { apiRequest, toDateLabel, toNumber } from "@/features/admin/components/shared/admin-api";

import type {
  PendingCreditReportRow,
  RegularCustomerReportRow,
  TopSpenderReportRow,
} from "./report.types";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function readFirst(value: UnknownRecord, keys: string[]): unknown {
  for (const key of keys) {
    if (key in value && value[key] != null) {
      return value[key];
    }
  }
  return undefined;
}

function readString(value: UnknownRecord, keys: string[], fallback = ""): string {
  const target = readFirst(value, keys);
  if (typeof target === "string") return target;
  if (typeof target === "number") return String(target);
  return fallback;
}

function readNumber(value: UnknownRecord, keys: string[], fallback = 0): number {
  const target = readFirst(value, keys);
  return toNumber(target, fallback);
}

function readOptionalDate(value: UnknownRecord, keys: string[]): string | undefined {
  const raw = readString(value, keys);
  return raw.length > 0 ? raw : undefined;
}

function unwrapArrayInternal<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== "object") return [];

  const record = payload as UnknownRecord;
  if (Array.isArray(record.data)) return record.data as T[];
  if (Array.isArray(record.items)) return record.items as T[];
  if (Array.isArray(record.records)) return record.records as T[];

  if (record.data && typeof record.data === "object") {
    const dataRecord = record.data as UnknownRecord;
    if (Array.isArray(dataRecord.items)) return dataRecord.items as T[];
    if (Array.isArray(dataRecord.records)) return dataRecord.records as T[];
  }

  return [];
}

export async function fetchTopSpenders(): Promise<{ rows: TopSpenderReportRow[]; error: string | null }> {
  const result = await apiRequest<unknown>("/api/reports/customers/top-spenders");
  if (result.error) {
    return { rows: [], error: result.error };
  }

  const rows = unwrapArrayInternal<unknown>(result.data).map((item, index) => {
    const row = asRecord(item);
    const rowId =
      readString(row, ["customerId", "CustomerId", "id", "Id"], `top-spender-${index}`) ||
      `top-spender-${index}`;

    return {
      rowId,
      customerId: readString(row, ["customerId", "CustomerId", "id", "Id"]) || undefined,
      customerName:
        readString(row, ["customerName", "CustomerName", "fullName", "FullName", "name", "Name"], "Unknown Customer"),
      email: readString(row, ["email", "Email"], "-"),
      phone: readString(row, ["phone", "Phone"], "-"),
      purchaseCount: readNumber(row, ["purchaseCount", "PurchaseCount"], 0),
      totalSpent: readNumber(row, ["totalSpent", "TotalSpent"], 0),
      lastPurchaseDate: readOptionalDate(row, ["lastPurchaseDate", "LastPurchaseDate"]),
    } satisfies TopSpenderReportRow;
  });

  return { rows, error: null };
}

export async function fetchRegularCustomers(): Promise<{ rows: RegularCustomerReportRow[]; error: string | null }> {
  const result = await apiRequest<unknown>("/api/reports/customers/regular");
  if (result.error) {
    return { rows: [], error: result.error };
  }

  const rows = unwrapArrayInternal<unknown>(result.data).map((item, index) => {
    const row = asRecord(item);
    const rowId =
      readString(row, ["customerId", "CustomerId", "id", "Id"], `regular-customer-${index}`) ||
      `regular-customer-${index}`;

    return {
      rowId,
      customerId: readString(row, ["customerId", "CustomerId", "id", "Id"]) || undefined,
      customerName:
        readString(row, ["customerName", "CustomerName", "fullName", "FullName", "name", "Name"], "Unknown Customer"),
      email: readString(row, ["email", "Email"], "-"),
      phone: readString(row, ["phone", "Phone"], "-"),
      purchaseCount: readNumber(row, ["purchaseCount", "PurchaseCount"], 0),
      totalSpent: readNumber(row, ["totalSpent", "TotalSpent"], 0),
      lastPurchaseDate: readOptionalDate(row, ["lastPurchaseDate", "LastPurchaseDate"]),
    } satisfies RegularCustomerReportRow;
  });

  return { rows, error: null };
}

export async function fetchPendingCredit(): Promise<{ rows: PendingCreditReportRow[]; error: string | null }> {
  const result = await apiRequest<unknown>("/api/reports/customers/pending-credit");
  if (result.error) {
    return { rows: [], error: result.error };
  }

  const rows = unwrapArrayInternal<unknown>(result.data).map((item, index) => {
    const row = asRecord(item);
    const saleId = readString(row, ["saleId", "SaleId", "id", "Id"], "-");

    return {
      rowId: saleId.length > 0 ? saleId : `pending-credit-${index}`,
      saleId,
      customerId: readString(row, ["customerId", "CustomerId"]) || undefined,
      customerName:
        readString(row, ["customerName", "CustomerName", "fullName", "FullName", "name", "Name"], "Unknown Customer"),
      email: readString(row, ["email", "Email"], "-"),
      phone: readString(row, ["phone", "Phone"], "-"),
      saleDate: readOptionalDate(row, ["saleDate", "SaleDate"]),
      creditAmount: readNumber(row, ["creditAmount", "CreditAmount", "totalAmount", "TotalAmount", "amount", "Amount"], 0),
      daysOverdue: readNumber(row, ["daysOverdue", "DaysOverdue"], 0),
    } satisfies PendingCreditReportRow;
  });

  return { rows, error: null };
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

export function unwrapArray<T>(payload: unknown): T[] {
  return unwrapArrayInternal<T>(payload);
}

function escapeCsvCell(value: unknown): string {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number>>): void {
  const csv = [headers, ...rows]
    .map((line) => line.map((value) => escapeCsvCell(value)).join(","))
    .join("\n");

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

interface PrintableReportOptions {
  activeReport?: string;
  filterSummary?: string;
}

export function exportPrintableReport(
  title: string,
  headers: string[],
  rows: Array<Array<string | number>>,
  options?: PrintableReportOptions
): void {
  const escapeHtml = (value: string): string =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const htmlRows = rows
    .map(
      (columns) =>
        `<tr>${columns.map((column) => `<td style="padding:8px;border:1px solid #d1d5db;">${escapeHtml(String(column ?? ""))}</td>`).join("")}</tr>`
    )
    .join("");

  const printableHtml = `
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
          h1 { font-size: 20px; margin-bottom: 12px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { text-align: left; font-size: 12px; }
          th { padding: 8px; border: 1px solid #d1d5db; background: #f3f4f6; }
          .meta { margin-bottom: 12px; color: #374151; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <div class="meta">Generated at ${new Date().toLocaleString()}</div>
        ${options?.activeReport ? `<div class="meta"><strong>Report:</strong> ${escapeHtml(options.activeReport)}</div>` : ""}
        ${options?.filterSummary ? `<div class="meta"><strong>Filters:</strong> ${escapeHtml(options.filterSummary)}</div>` : ""}
        <table>
          <thead>
            <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${htmlRows}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=1000,height=800");
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(printableHtml);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
