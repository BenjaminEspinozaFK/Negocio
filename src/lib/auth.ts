import { NextRequest, NextResponse } from 'next/server';

/**
 * Verifica si la petición viene de una sesión autenticada
 * Para APIs protegidas del admin
 */
export function isAuthenticated(request: NextRequest): boolean {
    // Opción 1: Verificar header de autorización
    const authHeader = request.headers.get('authorization');

    // Opción 2: Verificar cookie de sesión (más seguro)
    const sessionCookie = request.cookies.get('admin-session');

    return !!(authHeader === `Bearer ${process.env.ADMIN_API_KEY}` || sessionCookie);
}

/**
 * Middleware para proteger rutas de API
 */
export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
    return async (req: NextRequest) => {
        // Verificar autenticación
        const authHeader = req.headers.get('x-admin-auth');

        if (authHeader !== process.env.ADMIN_API_KEY) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        return handler(req);
    };
}
