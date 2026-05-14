/** ASP.NET Identity uses this claim for the user id in JWT payloads. */
const CLAIM_NAME_IDENTIFIER =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

const CLAIM_EMAIL =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

const CLAIM_NAME =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

function decodeBase64Url(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const pad = (4 - (base64.length % 4)) % 4;
  return atob(base64 + "=".repeat(pad));
}

function readJwtPayload(authorization: string): Record<string, unknown> | null {
  try {
    const token = authorization.replace(/^Bearer\s+/i, "").trim();
    const parts = token.split(".");
    if (parts.length < 2) return null;
    return JSON.parse(decodeBase64Url(parts[1])) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * When the real API is Admin/Staff-only, the BFF can still show account basics
 * using claims from the login JWT.
 */
export function getJwtAccountSnapshot(authorization: string): {
  userId: string;
  email: string;
  displayName: string;
} | null {
  const payload = readJwtPayload(authorization);
  if (!payload) return null;

  const userId =
    (payload.userId as string | undefined)?.trim() ||
    (payload.sub as string | undefined)?.trim() ||
    (payload.id as string | undefined)?.trim() ||
    (payload[CLAIM_NAME_IDENTIFIER] as string | undefined)?.trim() ||
    (payload.nameid as string | undefined)?.trim();

  if (!userId) return null;

  const email =
    (payload[CLAIM_EMAIL] as string | undefined)?.trim() ||
    (payload.email as string | undefined)?.trim() ||
    "";

  const nameClaim =
    ((payload[CLAIM_NAME] as string | undefined) ?? "").trim() ||
    ((payload.name as string | undefined) ?? "").trim();

  let displayName = nameClaim;
  if (!displayName || (email && displayName === email)) {
    displayName = email.includes("@")
      ? (email.split("@")[0] ?? "Customer")
      : email || "Customer";
  }

  return { userId, email, displayName };
}

/**
 * Reads the application user id from a Bearer JWT for BFF routes that must
 * build backend URLs. Supports standard claims and ASP.NET NameIdentifier.
 */
export function getUserIdFromJwtAuthHeader(authorization: string): string | null {
  const snap = getJwtAccountSnapshot(authorization);
  return snap?.userId ?? null;
}
