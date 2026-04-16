import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
  firstName: string;
  lastName: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

// Parse "7d", "24h", "60m" → seconds
function parseDuration(dur: string): number {
  const match = dur.match(/^(\d+)(d|h|m|s)$/);
  if (!match) return 60 * 60 * 24 * 7; // default 7d
  const n = parseInt(match[1]);
  switch (match[2]) {
    case "d": return n * 86400;
    case "h": return n * 3600;
    case "m": return n * 60;
    case "s": return n;
    default:  return 604800;
  }
}

export async function signToken(payload: JWTPayload): Promise<string> {
  const expiresIn = parseDuration(JWT_EXPIRES_IN);
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export function getSessionUser(): JWTPayload | null {
  // Synchronous read — used in Server Components/Actions (Node.js runtime only)
  const cookieStore = cookies();
  const token = cookieStore.get("banking-token")?.value;
  if (!token) return null;

  // Decode without verification for server components (verification happens in middleware)
  // Full async verification is available via verifyToken()
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const decoded = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
    );
    return decoded as JWTPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string) {
  cookies().set("banking-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie() {
  cookies().set("banking-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
