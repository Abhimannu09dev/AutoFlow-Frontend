import { NextResponse } from "next/server";
import { getUserIdFromJwtAuthHeader } from "@/lib/getUserIdFromJwtAuthHeader";

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

    const customerId = getUserIdFromJwtAuthHeader(authHeader);
    if (!customerId) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Invalid token',
        data: [],
        errorType: 'Unauthorized'
      }, { status: 401 });
    }

    const backend = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294";

    const response = await fetch(`${backend}/api/customers/${customerId}/purchases`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
    });

    if (response.status === 403) {
      return NextResponse.json({
        isSuccess: true,
        message: null,
        data: [],
        errorType: "None",
      });
    }

    const text = await response.text();
    const contentType = response.headers.get("content-type") ?? "application/json";

    return new NextResponse(text, {
      status: response.status,
      headers: { "content-type": contentType },
    });
  } catch (error) {
    console.error('Purchases GET error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      isSuccess: false,
      message: `Server error: ${message}`,
      data: [],
      errorType: 'ServerError'
    }, { status: 500 });
  }
}
