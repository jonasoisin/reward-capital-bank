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

// Which surface a request belongs to, derived from the Host header.
//
// "standalone" is the catch-all: any host that is not a recognised subdomain
// of ROOT_DOMAIN serves every route from a single origin, path-based, the way
// the app worked before subdomain routing existed. That covers localhost,
// LAN IPs, Vercel preview URLs and any future domain, and it is the DEFAULT —
// cross-origin redirects only ever happen on hosts we positively recognise.
// Defaulting the other way is what sent local logins to production.
type Surface = "admin" | "app" | "marketing" | "standalone";

const ROOT_DOMAIN = (
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "gainsboroughcapital.org"
).toLowerCase();

function getSurface(host: string): Surface {
  // Strip port (localhost:3000, 127.0.0.1:3000). IPv6 literals arrive
  // bracketed ("[::1]:3000"), so strip a trailing :digits rather than
  // splitting on the first colon.
  const hostname = host.replace(/:\d+$/, "").toLowerCase();

  // Recognised production subdomains. "www" is treated as the apex.
  if (hostname === `admin.${ROOT_DOMAIN}`) return "admin";
  if (hostname === `app.${ROOT_DOMAIN}`) return "app";
  if (hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`) {
    return "marketing";
  }

  // Local subdomain development: admin.localhost:3000 / app.localhost:3000.
  // Scoped to hosts without a public suffix so a preview URL that merely
  // begins with "app." is not mistaken for the portal.
  if (hostname.endsWith(".localhost")) {
    if (hostname.startsWith("admin.")) return "admin";
    if (hostname.startsWith("app.")) return "app";
  }

  // Everything else — localhost, IPs, preview deploys, new domains.
  return "standalone";
}

// Paths belonging to the authenticated user portal.
const USER_PATHS = [
  "/dashboard",
  "/my-banks",
  "/payment-transfer",
  "/recipients",
  "/notifications",
  "/transaction-history",
  "/transfer-success",
];

function isUserPath(pathname: string) {
  return USER_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";
  const surface = getSurface(host);

  const token = request.cookies.get("banking-token")?.value;
  const payload = token ? await getPayload(token) : null;

  // ---------------------------------------------------------------
  // Standalone host — no subdomain split available, so both trees are
  // served from one origin using path-based rules. Never redirects to
  // another host, so logins always complete on the origin they started on.
  // ---------------------------------------------------------------
  if (surface === "standalone") {
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

    if (pathname === "/account-blocked") {
      return NextResponse.next();
    }

    if (pathname === "/sign-in" || pathname === "/sign-up") {
      if (payload?.role === "user") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (payload?.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    if (isUserPath(pathname) && (!payload || payload.role !== "user")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  }

  // ---------------------------------------------------------------
  // admin.<root> — serves the /admin/* tree at the subdomain root.
  // ---------------------------------------------------------------
  if (surface === "admin") {
    // Requests arrive bare ("/dashboard") but links and server-side redirects
    // across the app still use the "/admin/dashboard" spelling. Accept both:
    // strip any existing prefix first, then apply exactly one.
    const bare = pathname === "/admin"
      ? "/"
      : pathname.startsWith("/admin/")
        ? pathname.slice("/admin".length)
        : pathname;

    const adminPath = `/admin${bare === "/" ? "" : bare}`;

    const isLogin = bare === "/login" || bare === "/";

    if (isLogin) {
      if (payload?.role === "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.rewrite(new URL("/admin/login", request.url));
    }

    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Canonicalise the visible URL to the bare spelling so the subdomain
    // never displays the redundant "/admin" prefix.
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(
        new URL(bare + request.nextUrl.search, request.url)
      );
    }

    return NextResponse.rewrite(new URL(adminPath, request.url));
  }

  // ---------------------------------------------------------------
  // app.<root> — user portal. The /admin tree is not reachable here.
  // ---------------------------------------------------------------
  if (surface === "app") {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname === "/account-blocked") {
      return NextResponse.next();
    }

    if (pathname === "/sign-in" || pathname === "/sign-up") {
      if (payload?.role === "user") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Bare app.<root> lands on the portal entry point.
    if (pathname === "/") {
      return NextResponse.redirect(
        new URL(payload?.role === "user" ? "/dashboard" : "/sign-in", request.url)
      );
    }

    if (isUserPath(pathname) && (!payload || payload.role !== "user")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  }

  // ---------------------------------------------------------------
  // Apex — marketing only. Authenticated surfaces move to subdomains.
  // ---------------------------------------------------------------
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(
      new URL(`/login`, `https://admin.${ROOT_DOMAIN}`)
    );
  }

  const movedToApp =
    isUserPath(pathname) || pathname === "/sign-in" || pathname === "/sign-up";

  if (movedToApp) {
    return NextResponse.redirect(
      new URL(pathname + request.nextUrl.search, `https://app.${ROOT_DOMAIN}`)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Everything except Next internals, the API, and static files. Host-based
    // routing needs to see bare "/" on each subdomain, so this cannot be a
    // path allowlist the way it was before subdomains.
    "/((?!api|_next|_static|favicon.ico|.*\\.).*)",
  ],
};
