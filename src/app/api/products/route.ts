import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Revalidar cada 60 segundos
export const revalidate = 60;

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: [
                { category: 'asc' },
                { name: 'asc' }
            ]
        });

        return NextResponse.json(products, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
            }
        });
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
        // 🔒 Verificar autenticación
        const authHeader = request.headers.get('x-admin-auth');
        if (authHeader !== process.env.ADMIN_API_KEY) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

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
