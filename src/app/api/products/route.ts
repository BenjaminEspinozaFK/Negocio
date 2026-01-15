import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: [
                { category: 'asc' },
                { name: 'asc' }
            ]
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return NextResponse.json(
            { error: 'Error al obtener productos' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const newProduct = await prisma.product.create({
            data: {
                name: data.name,
                category: data.category,
                price: data.price,
                unit: data.unit,
                image: data.image,
            }
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error al crear producto:', error);
        return NextResponse.json(
            { error: 'Error al crear el producto' },
            { status: 500 }
        );
    }
}
