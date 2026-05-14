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

    const response = await fetch(`${backend}/api/reviews`, {
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
    console.error('Reviews GET error:', error);
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
    const backend = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294";

    const response = await fetch(`${backend}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    const contentType = response.headers.get("content-type") ?? "application/json";

    return new NextResponse(text, {
      status: response.status,
      headers: { "content-type": contentType },
    });
  } catch (error) {
    console.error('Reviews POST error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      isSuccess: false,
      message: `Server error: ${message}`,
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}
