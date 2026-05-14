import { NextResponse } from "next/server";
import { getUserIdFromJwtAuthHeader } from "@/lib/getUserIdFromJwtAuthHeader";

/** Backend requires `CustomerId` = `Customers.Id`, not the login user id. */
async function customerIdExistsOnBackend(
  backend: string,
  authHeader: string,
  customerId: string
): Promise<boolean> {
  try {
    const r = await fetch(`${backend}/api/predictions/${encodeURIComponent(customerId)}`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    });
    return r.ok;
  } catch {
    return false;
  }
}

function normalizeTimeForApi(timeRaw: string): string {
  const t = timeRaw.trim();
  if (!t) return t;
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(t);
  if (!m) return t;
  const h = m[1]!.padStart(2, "0");
  const min = m[2]!.padStart(2, "0");
  const sec = (m[3] ?? "00").padStart(2, "0");
  return `${h}:${min}:${sec}`;
}

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

    const response = await fetch(`${backend}/api/appointments`, {
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
    console.error('Appointments GET error:', error);
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

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({
        isSuccess: false,
        message: "Invalid JSON body",
        data: null,
        errorType: "ValidationError",
      }, { status: 400 });
    }

    const backend = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294";

    const rawCustomerId = String(body.customerId ?? body.CustomerId ?? "").trim();
    if (!rawCustomerId) {
      return NextResponse.json({
        isSuccess: false,
        message: "CustomerId is required.",
        data: null,
        errorType: "ValidationError",
      }, { status: 400 });
    }

    const exists = await customerIdExistsOnBackend(backend, authHeader, rawCustomerId);
    if (!exists) {
      const jwtUser = getUserIdFromJwtAuthHeader(authHeader);
      const looksLikeLoginId =
        jwtUser !== null && rawCustomerId.toLowerCase() === jwtUser.toLowerCase();
      return NextResponse.json(
        {
          isSuccess: false,
          message: looksLikeLoginId
            ? "Appointments require your AutoFlow customer profile id (the Customers table id), not your login user id. Staff can see this id in the admin customer list, or the API needs to return it after login."
            : "No customer record exists for the given CustomerId. Check the value and try again.",
          data: null,
          errorType: "ValidationError",
        },
        { status: 200 }
      );
    }

    const timeRaw = String(body.time ?? body.Time ?? "").trim();

    const forwardBody = {
      customerId: rawCustomerId,
      date: body.date ?? body.Date,
      time: normalizeTimeForApi(timeRaw),
      status: body.status ?? body.Status,
    };

    const response = await fetch(`${backend}/api/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify(forwardBody),
    });

    const text = await response.text();
    const contentType = response.headers.get("content-type") ?? "application/json";

    return new NextResponse(text, {
      status: response.status,
      headers: { "content-type": contentType },
    });
  } catch (error) {
    console.error('Appointments POST error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      isSuccess: false,
      message: `Server error: ${message}`,
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}
