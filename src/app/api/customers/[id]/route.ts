import { NextResponse } from "next/server";

const backend = () =>
  process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Forward authorization header
    const authHeader = request.headers.get('authorization');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers.authorization = authHeader;
    }

    const response = await fetch(`${backend()}/api/customers/${id}`, {
      method: 'GET',
      headers,
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: { 
        'content-type': response.headers.get('content-type') ?? 'application/json' 
      },
    });
  } catch (error) {
    console.error('Customer API error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ 
      isSuccess: false, 
      message: `Server error: ${message}`,
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Forward authorization header
    const authHeader = request.headers.get('authorization');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers.authorization = authHeader;
    }

    const response = await fetch(`${backend()}/api/customers/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: { 
        'content-type': response.headers.get('content-type') ?? 'application/json' 
      },
    });
  } catch (error) {
    console.error('Update customer API error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ 
      isSuccess: false, 
      message: `Server error: ${message}`,
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}