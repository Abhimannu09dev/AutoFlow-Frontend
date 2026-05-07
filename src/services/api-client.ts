const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...init } = options;
  const url = new URL(`${BASE_URL}${path}`);

  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message ?? "Request failed");
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "GET", ...options }),
  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body), ...options }),
  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body), ...options }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "DELETE", ...options }),
};
