import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: "Faltan datos requeridos" },
                { status: 400 }
            );
        }

        // Validar que la nueva contraseña tenga al menos 6 caracteres
        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "La nueva contraseña debe tener al menos 6 caracteres" },
                { status: 400 }
            );
        }

        // Obtener la configuración actual
        let settings = await prisma.settings.findUnique({
            where: { id: "admin-config" }
        });

        // Si no existe, crear con la contraseña del .env
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

        // Verificar la contraseña actual
        const isCurrentValid = await bcrypt.compare(currentPassword, settings.password);

        if (!isCurrentValid) {
            return NextResponse.json(
                { error: "La contraseña actual es incorrecta" },
                { status: 401 }
            );
        }

        // Hashear la nueva contraseña
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña en la base de datos
        await prisma.settings.update({
            where: { id: "admin-config" },
            data: { password: newHashedPassword }
        });

        return NextResponse.json({ 
            success: true,
            message: "Contraseña actualizada correctamente"
        });

    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        return NextResponse.json(
            { error: "Error al cambiar la contraseña" },
            { status: 500 }
        );
    }
}
