import { NextResponse } from 'next/server';
import productsData from '@/data/products.json';
import { Product } from '@/types/product';

let products: Product[] = productsData as Product[];

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const updatedProduct: Product = await request.json();

        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        products[index] = { ...products[index], ...updatedProduct, id };

        return NextResponse.json(products[index]);
    } catch (error) {
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
        const { id } = await params;
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        products.splice(index, 1);

        return NextResponse.json({ message: 'Producto eliminado' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al eliminar el producto' },
            { status: 500 }
        );
    }
}
