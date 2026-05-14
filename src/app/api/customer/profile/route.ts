import { NextResponse } from "next/server";
import {
  getJwtAccountSnapshot,
  getUserIdFromJwtAuthHeader,
} from "@/lib/getUserIdFromJwtAuthHeader";

export async function GET(request: Request) {
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

    const customerId = getUserIdFromJwtAuthHeader(authHeader);
    if (!customerId) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Invalid token',
        data: null,
        errorType: 'Unauthorized'
      }, { status: 401 });
    }

    const backend = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294";

    const response = await fetch(`${backend}/api/customers/${customerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
    });

    if (response.status === 403) {
      const snap = getJwtAccountSnapshot(authHeader);
      if (!snap) {
        return NextResponse.json({
          isSuccess: false,
          message: "Invalid token",
          data: null,
          errorType: "Unauthorized",
        }, { status: 401 });
      }
      const dto = {
        id: snap.userId,
        fullName: snap.displayName,
        email: snap.email,
        phone: "",
        address: "",
        createdAt: new Date().toISOString(),
        applicationUserId: snap.userId,
      };
      return NextResponse.json({
        isSuccess: true,
        message: null,
        data: dto,
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
    console.error('Profile GET error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      isSuccess: false,
      message: `Server error: ${message}`,
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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

    const customerId = getUserIdFromJwtAuthHeader(authHeader);
    if (!customerId) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Invalid token',
        data: null,
        errorType: 'Unauthorized'
      }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const backend = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294";

    const response = await fetch(`${backend}/api/customers/${customerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify(body),
    });

    if (response.status === 403) {
      return NextResponse.json(
        {
          isSuccess: false,
          message:
            "The server only allows staff to update customer records. Your changes were not saved.",
          data: null,
          errorType: "Unauthorized",
        },
        { status: 200 }
      );
    }

    const text = await response.text();
    const contentType = response.headers.get("content-type") ?? "application/json";

    return new NextResponse(text, {
      status: response.status,
      headers: { "content-type": contentType },
    });
  } catch (error) {
    console.error('Profile PUT error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      isSuccess: false,
      message: `Server error: ${message}`,
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}
