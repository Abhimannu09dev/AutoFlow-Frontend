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

    const response = await fetch(`${backend}/api/vehicles`, {
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
    console.error('Vehicles GET error:', error);
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

    const response = await fetch(`${backend}/api/vehicles`, {
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
    console.error('Vehicles POST error:', error);
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

    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Vehicle ID is required',
        data: null,
        errorType: 'ValidationError'
      }, { status: 400 });
    }

    const backend = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294";

    const response = await fetch(`${backend}/api/vehicles/${body.id}`, {
      method: "PUT",
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
    console.error('Vehicles PUT error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      isSuccess: false,
      message: `Server error: ${message}`,
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    const url = new URL(request.url);
    const vehicleId = url.searchParams.get('id');

    if (!vehicleId) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Vehicle ID is required',
        data: null,
        errorType: 'ValidationError'
      }, { status: 400 });
    }

    const backend = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294";

    const response = await fetch(`${backend}/api/vehicles/${vehicleId}`, {
      method: "DELETE",
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
    console.error('Vehicles DELETE error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      isSuccess: false,
      message: `Server error: ${message}`,
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}
