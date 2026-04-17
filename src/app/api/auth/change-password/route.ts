import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getOrCreateAdminSettings } from "@/lib/admin-settings";

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // Validar que la nueva contraseña tenga al menos 8 caracteres
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    // Validar contraseña fuerte
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { error: "La contraseña debe incluir mayúsculas, minúsculas y números" },
        { status: 400 }
      );
    }

    let settings;
    try {
      settings = await getOrCreateAdminSettings();
    } catch {
      return NextResponse.json({ error: "Error de configuración del servidor" }, { status: 500 });
    }

    // Verificar la contraseña actual
    const isCurrentValid = await bcrypt.compare(currentPassword, settings.password);

    if (!isCurrentValid) {
      return NextResponse.json({ error: "La contraseña actual es incorrecta" }, { status: 401 });
    }

    // Hashear la nueva contraseña
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña en la base de datos
    await prisma.settings.update({
      where: { id: "admin-config" },
      data: { password: newHashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    return NextResponse.json({ error: "Error al cambiar la contraseña" }, { status: 500 });
  }
}
