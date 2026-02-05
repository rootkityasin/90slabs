import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl;

  // Block access to sensitive paths
  const blockedPaths = [
    "/.env",
    "/.git",
    "/node_modules",
    "/.next",
    "/scripts",
  ];

  for (const path of blockedPaths) {
    if (url.pathname.startsWith(path)) {
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  // Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Download-Options", "noopen");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.mongodb.com https://res.cloudinary.com https://*.cloudinary.com",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // HSTS for production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  // Prevent caching of sensitive pages
  if (
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/api/admin")
  ) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  // Auth Protection for Admin Routes
  if (
    url.pathname.startsWith("/admin") &&
    !url.pathname.startsWith("/admin/login")
  ) {
    const adminKey = request.cookies.get("admin_key");
    if (!adminKey) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return response;
}

// Apply middleware to all routes except static files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
