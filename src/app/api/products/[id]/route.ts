import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { NextRequest } from "next/server";
import {
  validateProductName,
  validatePrice,
  validateCategory,
  validateUnit,
  validateImageBase64,
} from "@/lib/input-validation";
import { categories, units } from "@/types/product";

export const PUT = withAuth(async (request: NextRequest, ctx: unknown) => {
  const { params } = ctx as { params: Promise<{ id: string }> };
  try {
    const { id } = await params;
    const data = await request.json();

    // Validar y sanitizar nombre
    const nameValidation = validateProductName(data.name);
    if (!nameValidation.isValid) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 });
    }

    // Validar precio
    const priceValidation = validatePrice(data.price);
    if (!priceValidation.isValid) {
      return NextResponse.json({ error: priceValidation.error }, { status: 400 });
    }

    // Validar categoría
    const categoryValidation = validateCategory(data.category, categories);
    if (!categoryValidation.isValid) {
      return NextResponse.json({ error: categoryValidation.error }, { status: 400 });
    }

    // Validar unidad
    const unitValidation = validateUnit(data.unit, units);
    if (!unitValidation.isValid) {
      return NextResponse.json({ error: unitValidation.error }, { status: 400 });
    }

    // Validar imagen si existe
    if (data.image) {
      const imageValidation = validateImageBase64(data.image);
      if (!imageValidation.isValid) {
        return NextResponse.json({ error: imageValidation.error }, { status: 400 });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: nameValidation.value, // Usar valor sanitizado
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
