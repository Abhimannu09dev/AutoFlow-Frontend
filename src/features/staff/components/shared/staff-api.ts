import {
  apiRequest,
  toDateLabel,
  toNumber,
  unwrapArray,
  unwrapData,
} from "@/features/admin/components/shared/admin-api";

export { apiRequest, toDateLabel, toNumber, unwrapArray, unwrapData };

export function normalizePartRequestStatus(status: string | undefined): string {
  if (!status) return "Pending";
  const lowered = status.toLowerCase();
  if (lowered === "fulfilled") return "Done";
  if (lowered === "approved") return "Approved";
  return status;
}

export function toDateTimeLabel(dateValue?: string, timeValue?: string): string {
  if (!dateValue) return "-";
  const date = toDateLabel(dateValue);
  if (!timeValue) return date;
  return `${date} ${timeValue}`;
}
