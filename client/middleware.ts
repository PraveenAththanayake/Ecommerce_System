import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("token");
  const role = request.cookies.get("role");

  console.log("Middleware - Token:", authToken?.value);

  const isPublicPath = ["/login", "/register", "/forgot-password"].includes(
    request.nextUrl.pathname
  );

  const isProtectedPath =
    request.nextUrl.pathname.startsWith("/categories") ||
    request.nextUrl.pathname.startsWith("/dashboard");

  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

  console.log("Middleware - Path info:", {
    path: request.nextUrl.pathname,
    isPublicPath,
    isProtectedPath,
    hasToken: !!authToken,
    isAdminPath,
    role: role?.value,
  });

  // Handle public paths
  if (isPublicPath && authToken) {
    console.log("Middleware - Redirecting to dashboard due to existing token");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Handle protected paths
  if (isProtectedPath && !authToken) {
    console.log("Middleware - Redirecting to login due to missing token");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminPath) {
    if (!authToken) {
      console.log("Middleware - Redirecting to login due to missing token");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (role?.value !== "admin") {
      console.log("Middleware - Redirecting to home due to missing admin role");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/categories/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
