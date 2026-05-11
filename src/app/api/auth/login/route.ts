import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Login API: Received request for email:', email);

    // Validate input
    if (!email || !password) {
      console.log('Login API: Missing email or password');
      return NextResponse.json({
        IsSuccess: false,
        Message: "Email and password are required",
        Data: null,
        ErrorType: 1
      }, { status: 400 });
    }

    const backend = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294";
    console.log('Login API: Backend URL:', backend);

    // Connect to the real backend
    console.log('Login API: Making request to backend...');
    const response = await fetch(`${backend}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log('Login API: Backend response status:', response.status);
    console.log('Login API: Backend response ok:', response.ok);

    const text = await response.text();
    console.log('Login API: Backend response text:', text);
    
    const contentType = response.headers.get("content-type") ?? "application/json";

    return new NextResponse(text, {
      status: response.status,
      headers: { "content-type": contentType },
    });
  } catch (error) {
    console.error('Login API error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      IsSuccess: false,
      Message: `Server error: ${message}`,
      Data: null,
      ErrorType: 0
    }, { status: 500 });
  }
}
