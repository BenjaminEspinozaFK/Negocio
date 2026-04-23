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

type RouteHandler = (req: NextRequest, ctx?: unknown) => Promise<NextResponse>;

/**
 * Middleware para proteger rutas de API
 */
export function withAuth(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, ctx?: unknown) => {
    // Verificar autenticación por cookie
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    return handler(req, ctx);
  };
}

/**
 * Patrón Decorator.
 */
export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, ctx?: unknown) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      console.error("[API Error]", req.method, req.nextUrl.pathname, error);
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
  };
}
