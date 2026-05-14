import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;



    // Validate input
    if (!email || !password) {

      return NextResponse.json({
        IsSuccess: false,
        Message: "Email and password are required",
        Data: null,
        ErrorType: 1
      }, { status: 400 });
    }

    const backend = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294";


    // Connect to the real backend

    const response = await fetch(`${backend}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });




    const text = await response.text();

    
    const contentType = response.headers.get("content-type") ?? "application/json";

    return new NextResponse(text, {
      status: response.status,
      headers: { "content-type": contentType },
    });
  } catch (error) {

    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      IsSuccess: false,
      Message: `Server error: ${message}`,
      Data: null,
      ErrorType: 0
    }, { status: 500 });
  }
}
