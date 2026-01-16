"use client";

import { Product } from "@/types/product";
import Image from "next/image";
import { Edit2, Trash2, Package } from "lucide-react";

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
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group hover:-translate-y-1">
      {product.image && (
        <div className="relative h-32 sm:h-44 w-full overflow-hidden bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-full object-contain p-2 sm:p-3"
            unoptimized
          />
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-blue-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
            {product.category}
          </div>
        </div>
      )}

      <div className="p-3 sm:p-5">
        <div className="mb-2 sm:mb-3">
          {!product.image && (
            <span className="inline-block bg-blue-600 text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full mb-1.5 sm:mb-2">
              {product.category}
            </span>
          )}
          <h3 className="text-sm sm:text-xl font-semibold text-gray-900 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>

        <div className="flex justify-between items-end mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100">
          <div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </p>
            <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1 flex items-center gap-1 sm:gap-1.5">
              <Package className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              <span>por {product.unit}</span>
            </p>
          </div>

          {!readOnly && (
            <div className="flex gap-1.5 sm:gap-2">
              <button
                onClick={() => onEdit?.(product)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 sm:p-2 rounded-lg transition-colors touch-manipulation"
                title="Editar producto"
              >
                <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => onDelete?.(product.id)}
                className="bg-red-600 hover:bg-red-700 text-white p-1.5 sm:p-2 rounded-lg transition-colors touch-manipulation"
                title="Eliminar producto"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
