"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import Image from "next/image";
import { Edit2, Trash2, Package, AlertTriangle } from "lucide-react";
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
  readOnly?: boolean;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
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
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-slate-800/90 border-slate-700 hover:border-slate-600">
      {product.image && (
        <div className="relative h-32 sm:h-44 w-full overflow-hidden bg-white/95">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-full object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
          <Badge className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white border-0">
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
        <p className="text-lg sm:text-2xl font-bold text-blue-400">
          {formatPrice(product.price)}
        </p>
        <p className="text-[10px] sm:text-sm text-slate-400 mt-0.5 flex items-center gap-1.5">
          <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>por {product.unit}</span>
        </p>
      </CardContent>

      {!readOnly && (
        <>
          <CardFooter className="p-2 sm:p-4 pt-0 gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
            <Button
              onClick={() => onEdit?.(product)}
              variant="default"
              size="sm"
              className="flex-1 min-w-0 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9"
            >
              <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5 flex-shrink-0" />
              <span className="hidden sm:inline truncate">Editar</span>
            </Button>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
              size="sm"
              className="flex-1 min-w-0 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5 flex-shrink-0" />
              <span className="hidden sm:inline truncate">Eliminar</span>
            </Button>
          </CardFooter>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent className="bg-slate-800 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  ¿Eliminar producto?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-300">
                  Estás a punto de eliminar <span className="font-semibold text-white">&quot;{product.name}&quot;</span>.
                  Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </Card>
  );
}
