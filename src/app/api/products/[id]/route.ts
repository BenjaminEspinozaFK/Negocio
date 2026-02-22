import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 🔒 Verificar autenticación
        const authHeader = request.headers.get('x-admin-auth');
        if (authHeader !== process.env.ADMIN_API_KEY) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const data = await request.json();

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                category: data.category,
                price: data.price,
                unit: data.unit,
                image: data.image,
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
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 🔒 Verificar autenticación
        const authHeader = request.headers.get('x-admin-auth');
        if (authHeader !== process.env.ADMIN_API_KEY) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const { id } = await params;

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
