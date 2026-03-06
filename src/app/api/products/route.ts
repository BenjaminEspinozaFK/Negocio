import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';
import { NextRequest } from 'next/server';
import {
    validateProductName,
    validatePrice,
    validateCategory,
    validateUnit,
    validateImageBase64
} from '@/lib/input-validation';
import { categories, units } from '@/types/product';

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

        // Validar y sanitizar nombre
        const nameValidation = validateProductName(data.name);
        if (!nameValidation.isValid) {
            return NextResponse.json(
                { error: nameValidation.error },
                { status: 400 }
            );
        }

        // Validar precio
        const priceValidation = validatePrice(data.price);
        if (!priceValidation.isValid) {
            return NextResponse.json(
                { error: priceValidation.error },
                { status: 400 }
            );
        }

        // Validar categoría
        const categoryValidation = validateCategory(data.category, categories);
        if (!categoryValidation.isValid) {
            return NextResponse.json(
                { error: categoryValidation.error },
                { status: 400 }
            );
        }

        // Validar unidad
        const unitValidation = validateUnit(data.unit, units);
        if (!unitValidation.isValid) {
            return NextResponse.json(
                { error: unitValidation.error },
                { status: 400 }
            );
        }

        // Validar imagen si existe
        if (data.image) {
            const imageValidation = validateImageBase64(data.image);
            if (!imageValidation.isValid) {
                return NextResponse.json(
                    { error: imageValidation.error },
                    { status: 400 }
                );
            }
        }

        const newProduct = await prisma.product.create({
            data: {
                name: nameValidation.value, // Usar valor sanitizado
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
