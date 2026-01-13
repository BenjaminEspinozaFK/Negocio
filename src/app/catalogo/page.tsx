"use client";

import { useState, useEffect } from "react";
import { Product, categories } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function CatalogoPublico() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "Todas") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-4 px-2 sm:py-6 sm:px-4">
      {/* Contenedor con fondo claro */}
      <div className="max-w-[1400px] mx-auto min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl shadow-2xl py-8 px-4 relative">
        {/* Botón Admin - Posición absoluta en esquina */}
        <Link
          href="/admin"
          className="absolute top-6 right-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition-all duration-300 font-semibold hover:gap-3 group bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl z-10"
        >
          <span className="group-hover:animate-pulse">🔐</span>
          <span>Admin</span>
        </Link>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeIn">
            <div className="inline-block bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl p-10 mb-6 hover:shadow-3xl transition-all duration-500 border-4 border-blue-200 hover:border-purple-300 hover:scale-105">
              <div className="text-7xl mb-5 animate-bounce">🏪</div>
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">
                Provisiones Mily
              </h1>
              <div className="h-1.5 w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-700 text-xl font-medium">
                🛒 Nuestros productos y precios actualizados
              </p>
            </div>

            {/* Filtros */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border-2 border-blue-200 p-8 mb-10 hover:shadow-2xl transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    <span>Buscar Producto</span>
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Escribe el nombre del producto..."
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 text-gray-900 text-lg font-medium transition-all duration-200 hover:border-blue-400 shadow-sm hover:shadow-md"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📂</span>
                    <span>Filtrar por Categoría</span>
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 text-gray-900 text-lg font-bold transition-all duration-200 hover:border-purple-400 bg-white shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <option value="Todas">✨ Todas las categorías</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Lista de Productos - SOLO LECTURA */}
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin text-6xl mb-4">
                  ⏳
                </div>
                <p className="text-gray-600 text-xl font-semibold">
                  Cargando productos...
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border-2 border-gray-200">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-600 text-xl font-semibold">
                  {searchTerm || selectedCategory !== "Todas"
                    ? "No se encontraron productos con esos filtros"
                    : "No hay productos disponibles"}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8 inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl shadow-xl font-bold text-lg animate-pulse">
                  📦 {filteredProducts.length} producto
                  {filteredProducts.length !== 1 ? "s" : ""} disponible
                  {filteredProducts.length !== 1 ? "s" : ""}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      readOnly={true}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Footer */}
            <div className="mt-16 pt-10 border-t-4 border-gradient-to-r from-blue-300 to-purple-300 text-center">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 inline-block hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:scale-105">
                <p className="text-5xl mb-4">💚</p>
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  ¡Gracias por preferirnos!
                </p>
                <p className="text-gray-600 text-lg font-medium">
                  Tu negocio de confianza en la villa
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-2xl">⭐</span>
                  <span className="text-2xl">⭐</span>
                  <span className="text-2xl">⭐</span>
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
