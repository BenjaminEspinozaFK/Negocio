import {
  validateProductName,
  validatePrice,
  validateCategory,
  validateUnit,
  validateImageBase64,
} from "@/lib/input-validation";
import { categories, units } from "@/types/product";
import { NextResponse } from "next/server";

interface ProductInput {
  name: unknown;
  price: unknown;
  category: unknown;
  unit: unknown;
  image?: unknown;
}

interface ValidationSuccess {
  ok: true;
  sanitizedName: string;
}

interface ValidationFailure {
  ok: false;
  response: NextResponse;
}

export function validateProductInput(data: ProductInput): ValidationSuccess | ValidationFailure {
  const nameValidation = validateProductName(String(data.name ?? ""));
  if (!nameValidation.isValid) {
    return {
      ok: false,
      response: NextResponse.json({ error: nameValidation.error }, { status: 400 }),
    };
  }

  const priceValidation = validatePrice(Number(data.price ?? ""));
  if (!priceValidation.isValid) {
    return {
      ok: false,
      response: NextResponse.json({ error: priceValidation.error }, { status: 400 }),
    };
  }

  const categoryValidation = validateCategory(String(data.category ?? ""), categories);
  if (!categoryValidation.isValid) {
    return {
      ok: false,
      response: NextResponse.json({ error: categoryValidation.error }, { status: 400 }),
    };
  }

  const unitValidation = validateUnit(String(data.unit ?? ""), units);
  if (!unitValidation.isValid) {
    return {
      ok: false,
      response: NextResponse.json({ error: unitValidation.error }, { status: 400 }),
    };
  }

  if (data.image) {
    const imageValidation = validateImageBase64(String(data.image ?? ""));
    if (!imageValidation.isValid) {
      return {
        ok: false,
        response: NextResponse.json({ error: imageValidation.error }, { status: 400 }),
      };
    }
  }

  return { ok: true, sanitizedName: nameValidation.value };
}
