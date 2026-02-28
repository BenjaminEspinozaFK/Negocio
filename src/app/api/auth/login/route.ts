import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Intentar obtener la contraseña de la base de datos
        let settings = await prisma.settings.findUnique({
            where: { id: "admin-config" }
        });

        // Si no existe en BD, usar la del .env y crearla hasheada
        if (!settings) {
            const envPassword = process.env.ADMIN_PASSWORD || "Lidia1980";
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
            return NextResponse.json({ success: false }, { status: 401 });
        }
    } catch (error) {
        console.error("Error en login:", error);
        return NextResponse.json(
            { error: "Error al verificar contraseña" },
            { status: 500 }
        );
    }
}
