"use client";

import { useState, useEffect } from "react";
import { Product, categories } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Search, Filter, Store, Lock } from "lucide-react";

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
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <Link
              href="/admin"
              className="absolute top-4 right-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              <Lock className="w-4 h-4" />
              <span className="font-medium">Admin</span>
            </Link>
            
            <div className="flex items-center justify-center gap-3 mb-3">
              <Store className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Provisiones Mily
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Productos y precios actualizados
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                Buscar Producto
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Escribe el nombre del producto..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                Filtrar por Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white cursor-pointer"
              >
                <option value="Todas">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Productos */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">
              Cargando productos...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-gray-200">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 text-lg font-medium">
              {searchTerm || selectedCategory !== "Todas"
                ? "No se encontraron productos con esos filtros"
                : "No hay productos disponibles"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-600">
                Mostrando {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 p-6 text-center">
            <p className="text-gray-900 font-semibold text-lg mb-1">
              ¡Gracias por preferirnos!
            </p>
            <p className="text-gray-600">
              Tu negocio de confianza en la villa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
