import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';
import { NextRequest } from 'next/server';

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

export async function POST(request: NextRequest) {
    try {
        // 🔒 Verificar autenticación por cookie
        if (!isAuthenticated(request)) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

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

        const newProduct = await prisma.product.create({
            data: {
                name: data.name.trim(),
                category: data.category,
                price: data.price,
                unit: data.unit,
                image: data.image || null,
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
