import { NextResponse } from "next/server";

export function getBackendUrl(): string {
  return process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294";
}

function getProxyHeaders(request: Request): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const authorization = request.headers.get("authorization");
  if (authorization) {
    headers.authorization = authorization;
  }

  return headers;
}

export async function proxyRequest(
  request: Request,
  path: string
): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null);
    const res = await fetch(`${getBackendUrl()}${path}`, {
      method: request.method,
      headers: getProxyHeaders(request),
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ status: false, message }, { status: 502 });
  }
}

export async function proxyGet(path: string, request?: Request): Promise<NextResponse> {
  try {
    const res = await fetch(`${getBackendUrl()}${path}`, {
      headers: request ? getProxyHeaders(request) : undefined,
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ status: false, message }, { status: 502 });
  }
}
