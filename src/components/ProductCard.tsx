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
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2 gap-3">
        {product.image && (
          <div className="flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-md"
              unoptimized
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {product.name}
          </h3>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
            {product.category}
          </span>
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold text-green-600">
            {formatPrice(product.price)}
          </p>
          <p className="text-sm text-gray-500">por {product.unit}</p>
        </div>

        {!readOnly && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(product)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              ✏️ Editar
            </button>
            <button
              onClick={() => onDelete?.(product.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              🗑️ Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
