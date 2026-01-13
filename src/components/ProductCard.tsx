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
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-blue-300 group hover:-translate-y-2 hover:scale-105">
      {product.image && (
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-4"
            unoptimized
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
            <span className="text-xs font-bold text-blue-600">
              {product.category}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="mb-4">
          {!product.image && (
            <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-md">
              {product.category}
            </span>
          )}
          <h3 className="text-2xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
            {product.name}
          </h3>
        </div>

        <div className="flex justify-between items-end mt-5 pt-4 border-t-2 border-gray-100">
          <div>
            <p className="text-4xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
              {formatPrice(product.price)}
            </p>
            <p className="text-sm font-medium text-gray-500 mt-1.5 flex items-center gap-1">
              <span className="text-xs">📦</span>
              <span>por {product.unit}</span>
            </p>
          </div>

          {!readOnly && (
            <div className="flex gap-3">
              <button
                onClick={() => onEdit?.(product)}
                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-110 active:scale-95"
                title="Editar producto"
              >
                <span className="text-base">✏️</span>
              </button>
              <button
                onClick={() => onDelete?.(product.id)}
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-110 active:scale-95"
                title="Eliminar producto"
              >
                <span className="text-base">🗑️</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
