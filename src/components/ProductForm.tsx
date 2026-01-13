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
  const [fileInputKey, setFileInputKey] = useState(0); // Para resetear el input file

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price) {
      alert("Por favor completa todos los campos");
      return;
    }

    // Enviar explícitamente todos los campos, incluyendo image como cadena vacía si no existe
    onSubmit({
      name,
      category,
      price: parseFloat(price),
      unit,
      image: image || "", // Enviar cadena vacía en lugar de undefined
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
    setFileInputKey((prev) => prev + 1); // Resetear el input file
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8 border-2 border-blue-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-xl">🏷️</span>
            <span>Nombre del Producto</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 text-gray-900 text-lg font-medium transition-all duration-200 hover:border-blue-400 shadow-sm hover:shadow-md"
            placeholder="Ej: Tomate, Pan, Coca Cola"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-xl">📂</span>
              <span>Categoría</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 text-gray-900 text-lg font-medium transition-all duration-200 hover:border-blue-400 bg-white shadow-sm hover:shadow-md cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-xl">📦</span>
              <span>Unidad</span>
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 text-gray-900 text-lg font-medium transition-all duration-200 hover:border-blue-400 bg-white shadow-sm hover:shadow-md cursor-pointer"
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
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-xl">🖼️</span>
            <span>Imagen del Producto</span>
          </label>
          <div className="space-y-3">
            <input
              key={fileInputKey}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-4 border-2 border-dashed border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-blue-500 file:to-purple-500 file:text-white hover:file:from-blue-600 hover:file:to-purple-600 file:transition-all file:duration-300 file:shadow-lg hover:file:shadow-xl file:cursor-pointer text-gray-600 transition-all duration-200 hover:border-blue-400 cursor-pointer bg-blue-50"
            />
            {imagePreview && (
              <div className="relative inline-block group">
                <Image
                  src={imagePreview}
                  alt="Vista previa"
                  width={160}
                  height={160}
                  className="w-40 h-40 object-cover rounded-2xl border-4 border-blue-200 shadow-lg group-hover:shadow-2xl transition-all duration-300"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-xl">💰</span>
            <span>Precio (CLP)</span>
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 text-gray-900 text-lg font-bold transition-all duration-200 hover:border-green-400 shadow-sm hover:shadow-md"
            placeholder="Ej: 1500"
            min="0"
            step="1"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 active:scale-95 text-lg"
          >
            {product ? "💾 Guardar Cambios" : "➕ Agregar Producto"}
          </button>

          {product && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 active:scale-95 text-lg"
            >
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
