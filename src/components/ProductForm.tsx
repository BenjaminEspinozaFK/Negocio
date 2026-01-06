"use client";

import { useState } from "react";
import { Product, categories, units } from "@/types/product";
import Image from "next/image";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price) {
      alert("Por favor completa todos los campos");
      return;
    }

    onSubmit({
      name,
      category,
      price: parseFloat(price),
      unit,
      image: image || undefined,
    });

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
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona una imagen válida");
        return;
      }

      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen es muy grande. Máximo 2MB");
        return;
      }

      // Convertir a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage("");
    setImagePreview("");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {product ? "✏️ Editar Producto" : "➕ Agregar Nuevo Producto"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Producto
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Ej: Tomate, Pan, Coca Cola"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidad
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen del Producto
          </label>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-gray-900"
            />
            {imagePreview && (
              <div className="relative inline-block">
                <Image
                  src={imagePreview}
                  alt="Vista previa"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded-md border border-gray-300"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio (CLP)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="1500"
            min="0"
            step="50"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            {product ? "💾 Guardar Cambios" : "➕ Agregar Producto"}
          </button>

          {product && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
