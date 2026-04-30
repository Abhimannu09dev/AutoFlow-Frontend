import { NextResponse } from 'next/server';

// Proxy POST /api/customers -> BACKEND_URL/api/customers
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const backend = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

    const res = await fetch(`${backend}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();

    const contentType = res.headers.get('content-type') ?? 'application/json';

    return new NextResponse(text, {
      status: res.status,
      headers: { 'content-type': contentType },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new NextResponse(JSON.stringify({ message }), { status: 502, headers: { 'content-type': 'application/json' } });
  }
}

export async function GET() {
  return new NextResponse(JSON.stringify({ message: 'Use POST to create customers.' }), { status: 200, headers: { 'content-type': 'application/json' } });
}
