"use client";

import { apiRequest, toDateLabel, toNumber, unwrapArray, unwrapData } from "@/features/admin/components/shared/admin-api";

export { apiRequest, toDateLabel, toNumber, unwrapArray, unwrapData };

export function unwrapObject<T extends Record<string, unknown>>(payload: unknown, fallback: T): T {
  const value = unwrapData<Record<string, unknown> | null>(payload, null);
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fallback;
  }
  return value as T;
}

export function formatCurrency(value: number | undefined): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(toNumber(value, 0));
}

export function formatDateTime(date?: string, time?: string): string {
  const dateLabel = toDateLabel(date);
  if (!time) return dateLabel;
  return `${dateLabel} ${time}`;
}

export function toIsoDateInput(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}
