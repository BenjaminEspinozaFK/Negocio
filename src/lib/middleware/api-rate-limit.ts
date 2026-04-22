import { NextRequest, NextResponse } from "next/server";

/**
 * Rate limiting simple en memoria para rutas /api.
 * Máximo 60 requests por IP por minuto.
 * Nota: se resetea cuando el servidor reinicia (Edge Runtime).
 */
const requestCounts = new Map<string, { count: number; resetAt: number }>();

const LIMIT = 60; // max requests
const WINDOW_MS = 60_000; // 1 minuto

export function handleApiRateLimit(request: NextRequest): NextResponse | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return null; // no bloqueado
  }

  if (entry.count >= LIMIT) {
    return NextResponse.json(
      { error: "Demasiadas peticiones. Intentá de nuevo en un momento." },
      { status: 429 }
    );
  }

  entry.count++;
  return null; // no bloqueado
}
