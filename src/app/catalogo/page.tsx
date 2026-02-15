import { prisma } from "@/lib/prisma";
import CatalogoClient from "./CatalogoClient";
import { Product } from "@/types/product";

// Revalidar cada 60 segundos
export const revalidate = 60;

async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return products as Product[];
  } catch (error) {
    console.error("Error al cargar productos:", error);
    return [];
  }
}

export default async function CatalogoPublico() {
  const products = await getProducts();

  return <CatalogoClient initialProducts={products} />;
}
