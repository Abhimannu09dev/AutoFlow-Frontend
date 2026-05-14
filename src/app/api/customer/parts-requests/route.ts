import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Authorization header required',
        data: [],
        errorType: 'Unauthorized'
      }, { status: 401 });
    }

    const backend = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294";

    const response = await fetch(`${backend}/api/part-requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
    });

    const text = await response.text();
    const contentType = response.headers.get("content-type") ?? "application/json";

    return new NextResponse(text, {
      status: response.status,
      headers: { "content-type": contentType },
    });
  } catch (error) {
    console.error('Parts requests GET error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      isSuccess: false,
      message: `Server error: ${message}`,
      data: [],
      errorType: 'ServerError'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Authorization header required',
        data: null,
        errorType: 'Unauthorized'
      }, { status: 401 });
    }

    const body = await request.json();
    console.log('Parts request POST - Request body:', body);
    
    const backend = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294";
    console.log('Parts request POST - Backend URL:', `${backend}/api/part-requests`);

    const response = await fetch(`${backend}/api/part-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify(body),
    });

    console.log('Parts request POST - Response status:', response.status);
    const text = await response.text();
    console.log('Parts request POST - Response body:', text);
    
    const contentType = response.headers.get("content-type") ?? "application/json";

    return new NextResponse(text, {
      status: response.status,
      headers: { "content-type": contentType },
    });
  } catch (error) {
    console.error('Parts requests POST error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      isSuccess: false,
      message: `Server error: ${message}. Make sure backend is running at http://localhost:5294`,
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}
