import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("token");
  console.log("Middleware - Token:", authToken?.value);

  const isPublicPath = ["/login", "/register", "/forgot-password"].includes(
    request.nextUrl.pathname
  );

  const isProtectedPath =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/categories") ||
    request.nextUrl.pathname.startsWith("/dashboard");

  console.log("Middleware - Path info:", {
    path: request.nextUrl.pathname,
    isPublicPath,
    isProtectedPath,
    hasToken: !!authToken,
  });

  if (isProtectedPath && !authToken) {
    console.log("Middleware - Redirecting to login due to missing token");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicPath && authToken) {
    console.log("Middleware - Redirecting to dashboard due to existing token");
    return NextResponse.redirect(new URL("/", request.url));
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
