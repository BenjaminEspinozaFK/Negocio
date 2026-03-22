import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { NextRequest } from "next/server";
import {
  validateProductName,
  validatePrice,
  validateCategory,
  validateUnit,
  validateImageBase64,
} from "@/lib/input-validation";
import { categories, units } from "@/types/product";

// Revalidar cada 60 segundos
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = (searchParams.get("q") || "").trim();
    const category = (searchParams.get("category") || "").trim();
    const unit = (searchParams.get("unit") || "").trim();
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const sortByParam = (searchParams.get("sortBy") || "name").trim();
    const sortDirParam = (searchParams.get("sortDir") || "asc").trim();
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");

    const hasAdvancedQuery =
      request.nextUrl.search.length > 0 ||
      q.length > 0 ||
      category.length > 0 ||
      unit.length > 0 ||
      minPriceParam !== null ||
      maxPriceParam !== null ||
      pageParam !== null ||
      pageSizeParam !== null;

    const minPrice = minPriceParam !== null ? Number(minPriceParam) : null;
    const maxPrice = maxPriceParam !== null ? Number(maxPriceParam) : null;

    const validSortBy = ["name", "price", "createdAt", "category"] as const;
    const sortBy = validSortBy.includes(sortByParam as (typeof validSortBy)[number])
      ? (sortByParam as (typeof validSortBy)[number])
      : "name";
    const sortDir = sortDirParam === "desc" ? "desc" : "asc";

    const page = Math.max(1, Number(pageParam || "1") || 1);
    const pageSize = Math.min(48, Math.max(1, Number(pageSizeParam || "12") || 12));

    const where = {
      ...(q
        ? {
          name: {
            contains: q,
            mode: "insensitive" as const,
          },
        }
        : {}),
      ...(category && category !== "Todas" && categories.includes(category)
        ? { category }
        : {}),
      ...(unit && unit !== "Todas" && units.includes(unit) ? { unit } : {}),
      ...((minPrice !== null && Number.isFinite(minPrice)) ||
        (maxPrice !== null && Number.isFinite(maxPrice))
        ? {
          price: {
            ...(minPrice !== null && Number.isFinite(minPrice) ? { gte: minPrice } : {}),
            ...(maxPrice !== null && Number.isFinite(maxPrice) ? { lte: maxPrice } : {}),
          },
        }
        : {}),
    };

    if (!hasAdvancedQuery) {
      const products = await prisma.product.findMany({
        orderBy: [{ category: "asc" }, { name: "asc" }],
      });

      return NextResponse.json(products, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      });
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }, { name: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json(
      {
        data: products,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 🔒 Verificar autenticación por cookie
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

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

    const newProduct = await prisma.product.create({
      data: {
        name: nameValidation.value, // Usar valor sanitizado
        category: data.category,
        price: data.price,
        unit: data.unit,
        image: data.image || null,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json({ error: "Error al crear el producto" }, { status: 500 });
  }
}
