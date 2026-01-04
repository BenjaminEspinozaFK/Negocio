import { NextResponse } from 'next/server';
import productsData from '@/data/products.json';
import { Product } from '@/types/product';

// En una app real, esto estaría en una base de datos
let products: Product[] = productsData as Product[];

export async function GET() {
    return NextResponse.json(products);
}

export async function POST(request: Request) {
    try {
        const newProduct: Product = await request.json();

        // Generar ID único
        const maxId = products.length > 0
            ? Math.max(...products.map(p => parseInt(p.id)))
            : 0;
        newProduct.id = (maxId + 1).toString();

        products.push(newProduct);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al crear el producto' },
            { status: 500 }
        );
    }
}
