import { NextRequest, NextResponse } from "next/server";
import { handleAdminAuth } from "@/lib/middleware/admin-auth";
import { handleApiRateLimit } from "@/lib/middleware/api-rate-limit";
import { addSecurityHeaders } from "@/lib/middleware/security-headers";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Proteger rutas /admin — redirige a home si no hay sesión
  if (pathname.startsWith("/admin")) {
    const redirect = handleAdminAuth(request);
    if (redirect) return redirect;
  }

  // 2. Rate limiting en rutas /api — 60 req/min por IP
  if (pathname.startsWith("/api")) {
    const blocked = handleApiRateLimit(request);
    if (blocked) return blocked;
  }

  // 3. Agregar cabeceras de seguridad a todas las respuestas
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
