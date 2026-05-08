import { NextResponse } from "next/server";

export function getBackendUrl(): string {
  return process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
}

export async function proxyRequest(
  request: Request,
  path: string
): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null);
    const res = await fetch(`${getBackendUrl()}${path}`, {
      method: request.method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
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

export async function proxyGet(path: string): Promise<NextResponse> {
  try {
    const res = await fetch(`${getBackendUrl()}${path}`);
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
