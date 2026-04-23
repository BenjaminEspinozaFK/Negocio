import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, withErrorHandler } from "@/lib/auth";
import { NextRequest } from "next/server";
import { validateProductInput } from "@/lib/product-validation";
// import { categories, units } from "@/types/product";

export const PUT = withAuth(
  withErrorHandler(async (request: NextRequest, ctx: unknown) => {
    const { params } = ctx as { params: Promise<{ id: string }> };
    const { id } = await params;
    const data = await request.json();

    const validation = validateProductInput(data);
    if (!validation.ok) return validation.response;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: validation.sanitizedName,
        category: data.category,
        price: data.price,
        unit: data.unit,
        image: data.image || null,
      },
    });

    return NextResponse.json(updatedProduct);
    // ← sin try/catch, withErrorHandler lo maneja
  })
);

export const DELETE = withAuth(
  withErrorHandler(async (request: NextRequest, ctx: unknown) => {
    const { params } = ctx as { params: Promise<{ id: string }> };

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
  })
);
