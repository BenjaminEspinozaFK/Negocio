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
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group hover:-translate-y-1">
      {product.image && (
        <div className="relative h-44 w-full overflow-hidden bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-full object-contain p-3"
            unoptimized
          />
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            {product.category}
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="mb-3">
          {!product.image && (
            <span className="inline-block bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-2">
              {product.category}
            </span>
          )}
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-100">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </p>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              <span>por {product.unit}</span>
            </p>
          </div>

          {!readOnly && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(product)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                title="Editar producto"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete?.(product.id)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                title="Eliminar producto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
