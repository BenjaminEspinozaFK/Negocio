import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { isRateLimited, logLoginAttempt, getRemainingBlockTime } from "@/lib/rate-limit";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Obtener IP y User Agent del cliente
        const ipAddress = request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown";
        const userAgent = request.headers.get("user-agent") || "unknown";

        // Verificar si la IP está bloqueada por rate limiting
        const isBlocked = await isRateLimited(ipAddress);
        if (isBlocked) {
            const remainingMinutes = await getRemainingBlockTime(ipAddress);
            return NextResponse.json(
                {
                    error: `Demasiados intentos fallidos. Intenta nuevamente en ${remainingMinutes} minutos.`
                },
                { status: 429 } // Too Many Requests
            );
        }

        // Intentar obtener la contraseña de la base de datos
        let settings = await prisma.settings.findUnique({
            where: { id: "admin-config" }
        });

        // Si no existe en BD, usar la del .env y crearla hasheada
        if (!settings) {
            const envPassword = process.env.ADMIN_PASSWORD;
            if (!envPassword) {
                console.error("ADMIN_PASSWORD no está definida en las variables de entorno");
                return NextResponse.json(
                    { error: "Error de configuración del servidor" },
                    { status: 500 }
                );
            }
            const hashedPassword = await bcrypt.hash(envPassword, 10);

            settings = await prisma.settings.create({
                data: {
                    id: "admin-config",
                    password: hashedPassword
                }
            });
        }

        // Comparar la contraseña ingresada con la hasheada
        const isValid = await bcrypt.compare(password, settings.password);

        if (isValid) {
            // Registrar intento exitoso
            await logLoginAttempt(ipAddress, userAgent, true);

            const response = NextResponse.json({ success: true });

            // Establecer cookie de sesión segura
            response.cookies.set('admin-session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 24 horas
                path: '/',
            });

            return response;
        } else {
            // Registrar intento fallido
            await logLoginAttempt(ipAddress, userAgent, false);

            return NextResponse.json(
                { error: "Contraseña incorrecta" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Error en login:", error);
        return NextResponse.json(
            { error: "Error al verificar contraseña" },
            { status: 500 }
        );
    }
}
