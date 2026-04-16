import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function getPayload(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as { role?: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("banking-token")?.value;
  const payload = token ? await getPayload(token) : null;

  // Admin routes — require admin role
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (payload?.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }
    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // User routes — require user role
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/my-banks") ||
    pathname.startsWith("/payment-transfer") ||
    pathname.startsWith("/recipients") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/transfer-success")
  ) {
    if (!payload || payload.role !== "user") {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  // Account blocked page — always accessible
  if (pathname === "/account-blocked") {
    return NextResponse.next();
  }

  // Auth pages — redirect if already logged in
  if (pathname === "/sign-in" || pathname === "/sign-up") {
    if (payload?.role === "user") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (payload?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/my-banks/:path*",
    "/my-banks",
    "/payment-transfer",
    "/recipients",
    "/notifications",
    "/transfer-success",
    "/admin/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
