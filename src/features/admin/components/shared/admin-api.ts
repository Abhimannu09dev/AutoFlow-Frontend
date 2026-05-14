"use client";

import type { ApiEnvelope } from "./admin.types";

function getToken(): string | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem("autoflow_auth");
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Record<string, unknown>;
      const token = parsed.token;
      if (typeof token === "string" && token.length > 0) {
        return token;
      }
    } catch {
      if (stored.length > 0) {
        return stored;
      }
    }
  }

  const direct = localStorage.getItem("authToken");
  return direct && direct.length > 0 ? direct : null;
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  try {
    const token = getToken();
    const response = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as
      | (ApiEnvelope<T> & { Message?: string; Data?: T; IsSuccess?: boolean })
      | T
      | null;

    if (!response.ok) {
      const message =
        (typeof payload === "object" && payload
          ? String(
              (payload as { message?: string; Message?: string }).message ??
                (payload as { message?: string; Message?: string }).Message ??
                ""
            )
          : "") || `Request failed (${response.status})`;
      return { data: null, error: message };
    }

    if (payload && typeof payload === "object" && "data" in payload) {
      return { data: ((payload as ApiEnvelope<T>).data ?? null) as T | null, error: null };
    }

    if (payload && typeof payload === "object" && "Data" in payload) {
      return {
        data: ((payload as { Data?: T }).Data ?? null) as T | null,
        error: null,
      };
    }

    return { data: (payload as T | null) ?? null, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : String(error) };
  }
}

export function unwrapData<T>(payload: unknown, fallback: T): T {
  if (payload == null) return fallback;
  if (typeof payload !== "object") return payload as T;

  if ("data" in payload) {
    return unwrapData((payload as { data?: unknown }).data, fallback);
  }

  if ("Data" in payload) {
    return unwrapData((payload as { Data?: unknown }).Data, fallback);
  }

  return payload as T;
}

export function unwrapArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== "object") return [];

  if ("items" in payload && Array.isArray((payload as { items?: unknown }).items)) {
    return (payload as { items: T[] }).items;
  }

  if ("data" in payload) {
    return unwrapArray<T>((payload as { data?: unknown }).data);
  }

  if ("Data" in payload) {
    return unwrapArray<T>((payload as { Data?: unknown }).Data);
  }

  return [];
}

export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

export function toDateLabel(value: string | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}
