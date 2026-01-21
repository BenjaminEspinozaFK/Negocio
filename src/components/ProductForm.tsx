"use client";

import { useState } from "react";
import { Product, categories, units } from "@/types/product";
import Image from "next/image";
import { Tag, FolderOpen, Package, ImageIcon, DollarSign, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (product: Omit<Product, "id">) => void;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(product?.category || "Otros");
  const [price, setPrice] = useState(product?.price.toString() || "");
  const [unit, setUnit] = useState(product?.unit || "unidad");
  const [image, setImage] = useState(product?.image || "");
  const [imagePreview, setImagePreview] = useState(product?.image || "");
  const [fileInputKey, setFileInputKey] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    onSubmit({
      name,
      category,
      price: parseFloat(price),
      unit,
      image: image || "",
    });

    toast.success(product ? "Producto actualizado" : "Producto agregado");

    setName("");
    setCategory("Otros");
    setPrice("");
    setUnit("unidad");
    setImage("");
    setImagePreview("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor selecciona una imagen válida");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("La imagen es muy grande. Máximo 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        setImagePreview(base64String);
        toast.success("Imagen cargada correctamente");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage("");
    setImagePreview("");
    setFileInputKey((prev) => prev + 1);
    toast.info("Imagen eliminada");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-lg p-1">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Tag className="w-4 h-4 text-blue-600" />
          Nombre del Producto
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Tomate, Pan, Coca Cola"
          className="text-gray-900"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FolderOpen className="w-4 h-4 text-blue-600" />
            Categoría
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="text-gray-900">
              <SelectValue placeholder="Selecciona categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Package className="w-4 h-4 text-blue-600" />
            Unidad
          </Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger id="unit" className="text-gray-900">
              <SelectValue placeholder="Selecciona unidad" />
            </SelectTrigger>
            <SelectContent>
              {units.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <ImageIcon className="w-4 h-4 text-blue-600" />
          Imagen del Producto
        </Label>
        <Input
          key={fileInputKey}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="cursor-pointer text-gray-900"
        />
        {imagePreview && (
          <div className="relative inline-block">
            <Image
              src={imagePreview}
              alt="Vista previa"
              width={120}
              height={120}
              className="w-32 h-32 object-cover rounded-lg border"
              unoptimized
            />
            <Button
              type="button"
              onClick={handleRemoveImage}
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-7 w-7 rounded-full"
            >
              ✕
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <DollarSign className="w-4 h-4 text-blue-600" />
          Precio (CLP)
        </Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ej: 1500"
          min="0"
          step="1"
          className="text-gray-900"
        />
      </div>

      <div className="flex gap-3 pt-3">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {product ? "Guardar Cambios" : "Agregar Producto"}
        </Button>

        {product && (
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
