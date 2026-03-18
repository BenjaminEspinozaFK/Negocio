"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import Image from "next/image";
import { Edit2, Trash2, Package, AlertTriangle, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  onAddToCart?: (product: Product) => void;
  readOnly?: boolean;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onAddToCart,
  readOnly = false,
}: ProductCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  const handleDelete = () => {
    onDelete?.(product.id);
    setShowDeleteDialog(false);
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group bg-slate-800/90 border-slate-700 hover:border-blue-500/50 hover:-translate-y-1 animate-slideUp">
      {product.image && (
        <div className="relative h-32 sm:h-44 w-full overflow-hidden bg-white/95">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-full object-contain p-2 sm:p-3 group-hover:scale-110 transition-transform duration-500"
            unoptimized
          />
          <Badge className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white border-0 transition-all duration-300 hover:scale-110">
            {product.category}
          </Badge>
        </div>
      )}

      <CardHeader className="p-3 sm:p-4 pb-2">
        {!product.image && (
          <Badge className="w-fit mb-2 bg-blue-600 hover:bg-blue-700 text-white border-0">
            {product.category}
          </Badge>
        )}
        <h3 className="text-sm sm:text-lg font-semibold line-clamp-2 leading-tight text-white">
          {product.name}
        </h3>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 pt-0">
        <p className="text-lg sm:text-2xl font-bold text-blue-400">{formatPrice(product.price)}</p>
        <p className="text-[10px] sm:text-sm text-slate-400 mt-0.5 flex items-center gap-1.5">
          <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>por {product.unit}</span>
        </p>
      </CardContent>

      {!readOnly && (
        <>
          <CardFooter className="p-2 sm:p-4 pt-0 gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
            {onAddToCart && (
              <Button
                onClick={() => onAddToCart(product)}
                variant="outline"
                size="sm"
                className="flex-1 min-w-0 bg-green-600 hover:bg-green-700 border-green-700 text-white text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9 ripple-effect hover:scale-105 transition-transform duration-200"
              >
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5 flex-shrink-0" />
                <span className="hidden sm:inline truncate">Agregar</span>
              </Button>
            )}
            <Button
              onClick={() => onEdit?.(product)}
              variant="default"
              size="sm"
              className="flex-1 min-w-0 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9 ripple-effect hover:scale-105 transition-transform duration-200"
            >
              <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5 flex-shrink-0" />
              <span className="hidden sm:inline truncate">Editar</span>
            </Button>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
              size="sm"
              className="flex-1 min-w-0 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9 ripple-effect hover:scale-105 transition-transform duration-200"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5 flex-shrink-0" />
              <span className="hidden sm:inline truncate">Eliminar</span>
            </Button>
          </CardFooter>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent className="bg-slate-800 border-slate-700 max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-white text-xl">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  ¿Eliminar este producto?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-300 space-y-4">
                  <p className="text-base">
                    Estás a punto de eliminar permanentemente el siguiente producto:
                  </p>

                  {/* Información del producto */}
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-3">
                    {product.image && (
                      <div className="relative h-24 w-24 mx-auto mb-3 overflow-hidden rounded-lg bg-white/90">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-contain p-1"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-400 text-sm">Nombre:</span>
                        <p className="text-white font-semibold text-base">{product.name}</p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <span className="text-slate-400 text-sm">Categoría:</span>
                          <p className="text-white font-medium">{product.category}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm">Precio:</span>
                          <p className="text-white font-medium">{formatPrice(product.price)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <strong>Advertencia:</strong> Esta acción no se puede deshacer. El producto
                      será eliminado permanentemente de tu catálogo.
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2 sm:gap-2">
                <AlertDialogCancel className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600 font-medium">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Sí, eliminar producto
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </Card>
  );
}
