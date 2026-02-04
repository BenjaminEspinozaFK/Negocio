"use client";

import { useState, useEffect } from "react";
import { Product, categories } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Search, Filter, Store, Lock, ArrowUpDown, X } from "lucide-react";

export default function CatalogoPublico() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "price-asc" | "price-desc" | "date-desc">("date-desc");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products]; // Crear una copia del array

    // Filtrar por categoría
    if (selectedCategory !== "Todas") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filtrar por búsqueda de nombre
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar productos
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name, 'es'); // A-Z
        case "name-desc":
          return b.name.localeCompare(a.name, 'es'); // Z-A
        case "price-asc":
          return a.price - b.price; // Menor a mayor
        case "price-desc":
          return b.price - a.price; // Mayor a menor
        case "date-desc":
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

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
    <div className="min-h-screen py-3 sm:py-6 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-4 sm:mb-8">
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-slate-700 p-4 sm:p-8 text-center">
            <Link
              href="/admin"
              className="absolute top-2 right-2 sm:top-4 sm:right-4 inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-300 hover:text-blue-400 transition-colors px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-slate-700/50"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-medium hidden sm:inline">Admin</span>
            </Link>
            
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3 pr-12 sm:pr-0">
              <Store className="w-7 h-7 sm:w-10 sm:h-10 text-blue-400 flex-shrink-0" />
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                Provisiones Mily
              </h1>
            </div>
            <p className="text-slate-300 text-sm sm:text-lg">
              Productos y precios actualizados
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-md border border-slate-700 p-4 sm:p-6 mb-4 sm:mb-8">
          <div className="space-y-4">
            {/* Búsqueda, Categoría y Ordenar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 sm:mb-2 flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                  Buscar Producto
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Escribe el nombre..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-600 bg-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 sm:mb-2 flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                  Filtrar por Categoría
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-600 bg-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-white cursor-pointer"
                >
                  <option value="Todas">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 sm:mb-2 flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name-asc" | "name-desc" | "price-asc" | "price-desc" | "date-desc")}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-600 bg-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-white cursor-pointer"
                >
                  <option value="date-desc">Más recientes</option>
                  <option value="name-asc">Nombre A-Z</option>
                  <option value="name-desc">Nombre Z-A</option>
                  <option value="price-asc">Precio menor a mayor</option>
                  <option value="price-desc">Precio mayor a menor</option>
                </select>
              </div>
            </div>

            {/* Botón para limpiar filtros */}
            {(searchTerm || selectedCategory !== "Todas" || sortBy !== "date-desc") && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Todas");
                    setSortBy("date-desc");
                  }}
                  className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors inline-flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Productos */}
        {isLoading ? (
          <div className="text-center py-12 sm:py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-slate-700 border-t-blue-500 mb-3 sm:mb-4"></div>
            <p className="text-slate-300 text-base sm:text-lg font-medium">
              Cargando productos...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-20 bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-md border border-slate-700">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📦</div>
            <p className="text-slate-300 text-base sm:text-lg font-medium px-4">
              {searchTerm || selectedCategory !== "Todas"
                ? "No se encontraron productos"
                : "No hay productos disponibles"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 sm:mb-6">
              <p className="text-xs sm:text-sm font-medium text-slate-400 px-1">
                Mostrando {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
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
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-slate-700">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700 p-4 sm:p-6">
            <div className="max-w-2xl mx-auto space-y-3">
              {/* Nombre del negocio con línea */}
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">
                  Provisiones Mily
                </h3>
                <div className="w-16 h-0.5 bg-blue-500 mx-auto rounded-full"></div>
              </div>

              {/* Mensaje */}
              <div className="text-center">
                <p className="text-white font-semibold text-sm sm:text-base mb-1">
                  ¡Gracias por preferirnos!
                </p>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Tu negocio de confianza en la villa
                </p>
              </div>

              {/* Copyright */}
              <div className="text-center pt-2 border-t border-slate-700/50">
                <p className="text-slate-500 text-xs">
                  © 2026 Provisiones Mily
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
