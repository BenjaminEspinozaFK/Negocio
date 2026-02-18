"use client";

import { useState, useMemo } from "react";
import { Product, categories } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Search, Filter, Store, Lock, ArrowUpDown, X } from "lucide-react";

interface CatalogoClientProps {
  initialProducts: Product[];
}

export default function CatalogoClient({
  initialProducts,
}: CatalogoClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [sortBy, setSortBy] = useState<
    "name-asc" | "name-desc" | "price-asc" | "price-desc" | "date-desc"
  >("date-desc");

  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts];

    if (selectedCategory !== "Todas") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name, "es");
        case "name-desc":
          return b.name.localeCompare(a.name, "es");
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "date-desc":
        default:
          return 0;
      }
    });
  }, [initialProducts, searchTerm, selectedCategory, sortBy]);

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
              <Store className="w-7 h-7 sm:w-10 sm:h-10 text-blue-400 shrink-0" />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 sm:mb-2">
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Buscar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar producto..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400 text-sm sm:text-base pr-8"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 sm:mb-2">
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Categoría
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm sm:text-base"
                >
                  <option value="Todas">Todas</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 sm:mb-2">
                  <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Ordenar
                </label>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | "name-asc"
                        | "name-desc"
                        | "price-asc"
                        | "price-desc"
                        | "date-desc",
                    )
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm sm:text-base"
                >
                  <option value="date-desc">Más recientes</option>
                  <option value="name-asc">Nombre (A-Z)</option>
                  <option value="name-desc">Nombre (Z-A)</option>
                  <option value="price-asc">Precio (menor)</option>
                  <option value="price-desc">Precio (mayor)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-base sm:text-lg">
              {searchTerm || selectedCategory !== "Todas"
                ? "No se encontraron productos"
                : "No hay productos disponibles"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6 inline-block bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-sm font-semibold text-sm sm:text-base">
              📦 {filteredProducts.length} producto
              {filteredProducts.length !== 1 ? "s" : ""}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
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
        <div className="mt-12 sm:mt-16 text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 sm:p-8 inline-block border border-slate-700">
            <p className="text-xl sm:text-2xl mb-2">💚</p>
            <p className="text-slate-200 font-medium text-sm sm:text-base">
              Gracias por preferirnos
            </p>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Tu negocio de confianza
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
