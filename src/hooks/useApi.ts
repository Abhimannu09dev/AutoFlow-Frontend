"use client";

import { useState, useCallback } from "react";

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const request = useCallback(async (url: string, options?: RequestInit): Promise<T | null> => {
    setState({ data: null, isLoading: true, error: null });
    try {
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        const message = json?.message ?? json?.Message ?? res.statusText ?? "Request failed.";
        setState({ data: null, isLoading: false, error: message });
        return null;
      }
      setState({ data: json, isLoading: false, error: null });
      return json;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setState({ data: null, isLoading: false, error: message });
      return null;
    }
  }, []);

  return { ...state, request };
}
