import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// NEXT.JS 16 REQUEST PROXY LAYER
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabaseResponse, hasAuthToken } = await updateSession(request);

  // Login is available even when a customer session exists; role checks happen after sign-in.
  if (pathname === "/admin/login") {
    return supabaseResponse;
  }

  // 2. Protect all /admin routes (/admin, /admin/orders, /admin/menu, etc.)
  if (pathname.startsWith("/admin")) {
    if (!hasAuthToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  // 3. Redirect root `/` path to `/admin`
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
