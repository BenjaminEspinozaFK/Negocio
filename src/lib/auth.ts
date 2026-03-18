import { NextRequest, NextResponse } from "next/server";

/**
 * Verifica si la petición viene de una sesión autenticada
 * Para APIs protegidas del admin
 */
export function isAuthenticated(request: NextRequest): boolean {
  // Verificar cookie de sesión segura
  const sessionCookie = request.cookies.get("admin-session");
  return sessionCookie?.value === "authenticated";
}

/**
 * Middleware para proteger rutas de API
 */
export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Verificar autenticación por cookie
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    return handler(req);
  };
}
