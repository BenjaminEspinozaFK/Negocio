"use client";

import { Product } from "@/types/product";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  readOnly = false,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-400 group hover:-translate-y-1">
      {product.image && (
        <div className="relative h-32 w-full overflow-hidden bg-linear-to-br from-blue-50 to-indigo-50">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
            unoptimized
          />
        </div>
      )}

      <div className="p-5">
        <div className="mb-3">
          <span className="inline-block bg-linear-to-r from-blue-500 to-indigo-500 text-white text-xs font-medium px-3 py-1 rounded-full mb-2">
            {product.category}
          </span>
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div>
            <p className="text-3xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </p>
            <p className="text-sm text-gray-500 mt-1">por {product.unit}</p>
          </div>

          {!readOnly && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(product)}
                className="bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1"
                title="Editar producto"
              >
                <span>✏️</span>
              </button>
              <button
                onClick={() => onDelete?.(product.id)}
                className="bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1"
                title="Eliminar producto"
              >
                <span>🗑️</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
