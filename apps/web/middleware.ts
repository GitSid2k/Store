import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dub-stal-secret-dev-key-change-in-prod"
);
const COOKIE = "ds_session";
const PROTECTED = ["/account"];
const ADMIN_KEY = process.env.ADMIN_KEY ?? "admin-secret-key";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin protection
  if (pathname.startsWith("/admin")) {
    // Allow admin login page
    if (pathname === "/admin/login") return NextResponse.next();

    const token = req.cookies.get(COOKIE)?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, SECRET);
      // Simple admin check: require email to match ADMIN_KEY (or any user for now)
      // In production you'd have an isAdmin flag in User model
      return NextResponse.next();
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Regular user protection
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
