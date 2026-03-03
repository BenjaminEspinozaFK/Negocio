import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 🔒 Verificar autenticación por cookie
        if (!isAuthenticated(request)) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const data = await request.json();

        // Validaciones
        if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
            return NextResponse.json(
                { error: 'El nombre del producto es inválido' },
                { status: 400 }
            );
        }

        if (!data.price || typeof data.price !== 'number' || data.price <= 0) {
            return NextResponse.json(
                { error: 'El precio debe ser mayor a 0' },
                { status: 400 }
            );
        }

        if (!data.category || typeof data.category !== 'string') {
            return NextResponse.json(
                { error: 'La categoría es requerida' },
                { status: 400 }
            );
        }

        if (!data.unit || typeof data.unit !== 'string') {
            return NextResponse.json(
                { error: 'La unidad es requerida' },
                { status: 400 }
            );
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name: data.name.trim(),
                category: data.category,
                price: data.price,
                unit: data.unit,
                image: data.image || null,
            }
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        return NextResponse.json(
            { error: 'Error al actualizar el producto' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 🔒 Verificar autenticación por cookie
        if (!isAuthenticated(request)) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Verificar que el producto existe antes de eliminar
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });

        if (!existingProduct) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Producto eliminado' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        return NextResponse.json(
            { error: 'Error al eliminar el producto' },
            { status: 500 }
        );
    }
}
