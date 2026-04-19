import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { NextRequest } from "next/server";
import { validateProductInput } from "@/lib/product-validation";
// import { categories, units } from "@/types/product";

export const PUT = withAuth(async (request: NextRequest, ctx: unknown) => {
  const { params } = ctx as { params: Promise<{ id: string }> };
  try {
    const { id } = await params;
    const data = await request.json();

    // Validar todos los campos del producto
    const validation = validateProductInput(data);
    if (!validation.ok) return validation.response;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: validation.sanitizedName, // Usar valor sanitizado
        category: data.category,
        price: data.price,
        unit: data.unit,
        image: data.image || null,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return NextResponse.json({ error: "Error al actualizar el producto" }, { status: 500 });
  }
});

export const DELETE = withAuth(async (request: NextRequest, ctx: unknown) => {
  const { params } = ctx as { params: Promise<{ id: string }> };
  try {
    const { id } = await params;

    // Verificar que el producto existe antes de eliminar
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 });
  }
});
