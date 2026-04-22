import { NextResponse } from "next/server";

/**
 * Agrega cabeceras de seguridad HTTP estándar a todas las respuestas.
 * Previene clickjacking, MIME sniffing y ataques XSS básicos.
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}
