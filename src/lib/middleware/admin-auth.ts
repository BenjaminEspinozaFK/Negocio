import { NextRequest, NextResponse } from "next/server";

/**
 * Verifica autenticación para rutas /admin.
 * Retorna un redirect si no está autenticado, o null si puede continuar.
 */
export function handleAdminAuth(request: NextRequest): NextResponse | null {
  const session = request.cookies.get("admin-session");

  if (session?.value !== "authenticated") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return null;
}
