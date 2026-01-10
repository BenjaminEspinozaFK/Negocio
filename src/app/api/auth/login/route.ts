import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (password === adminPassword) {
            return NextResponse.json({ success: true });
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
