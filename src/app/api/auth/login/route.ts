import { proxyRequest } from "@/lib/api/proxy";
import { apiRoutes } from "@/configs/app.config";

export async function POST(request: Request) {
<<<<<<< HEAD:app/api/auth/login/route.ts
  return proxyRequest(request, apiRoutes.auth.login);
=======
  try {
    const body = await request.json();
    const backend =
      process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

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
    return NextResponse.json({ status: false, message }, { status: 502 });
  }
>>>>>>> c197738c5467c58b7261bf149c4d09d68d7868a5:src/app/api/auth/login/route.ts
}
