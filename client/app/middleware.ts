import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get token from cookies
  const authToken = request.cookies.get("auth-token")?.value;

  // Define public and protected paths
  const isPublicPath = ["/login", "/register"].includes(
    request.nextUrl.pathname
  );
  const isProtectedPath =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/profile");

  // If trying to access protected route without token
  if (isProtectedPath && !authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If trying to access auth pages with valid token
  if (isPublicPath && authToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*", "/profile/:path*"],
};
