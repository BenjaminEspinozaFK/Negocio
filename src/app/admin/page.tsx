"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/ProductCard";
import ProductForm from "@/components/ProductForm";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { Product, categories } from "@/types/product";
import Link from "next/link";
import PrintableProductList from "@/components/PrintableProductList";
import ShoppingCalculator, { ShoppingCalculatorRef } from "@/components/ShoppingCalculator";
import { Printer, Calculator } from "lucide-react";
import {
  Search,
  Filter,
  Plus,
  Settings,
  LogOut,
  ArrowLeft,
  Lock,
  X,
  Key,
  ArrowUpDown,
} from "lucide-react";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const calculatorRef = useRef<ShoppingCalculatorRef>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [sortBy, setSortBy] = useState<
    "name-asc" | "name-desc" | "price-asc" | "price-desc" | "date-desc"
  >("date-desc");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchProducts();
    } else {
      setIsLoading(false);
    }
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
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Ordenar productos
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name, "es"); // A-Z
        case "name-desc":
          return b.name.localeCompare(a.name, "es"); // Z-A
        case "price-asc":
          return a.price - b.price; // Menor a mayor
        case "price-desc":
          return b.price - a.price; // Mayor a menor
        case "date-desc":
        default:
          return 0; // Mantener orden original (más recientes primero)
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem("adminAuth", "true");
        fetchProducts();
      } else {
        setError("Contraseña incorrecta");
        setPassword("");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error al verificar contraseña");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
    setPassword("");
  };

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

  const handleAddProduct = async (product: Omit<Product, "id">) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        await fetchProducts();
        setShowModal(false);
      } else {
        alert("Error al agregar producto");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al agregar producto");
    }
  };

  const handleUpdateProduct = async (product: Omit<Product, "id">) => {
    if (!editingProduct) return;

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct.id,
          ...product,
        }),
      });

      if (response.ok) {
        await fetchProducts();
        setEditingProduct(null);
        setShowModal(false);
      } else {
        alert("Error al actualizar producto");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar producto");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProducts();
      } else {
        alert("Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar producto");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddToCart = (product: Product) => {
    if (calculatorRef.current) {
      calculatorRef.current.addToCart(product);
      setShowCalculator(true); // Abrir la calculadora al agregar
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 max-w-md w-full border border-gray-200">
          <div className="text-center mb-6">
            <div className="bg-blue-600 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Panel de Administración
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Ingresa la contraseña para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-base"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Ingresar
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/catalogo"
              className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin Panel
  return (
    <>
      <div className="min-h-screen py-3 sm:py-6 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-8">
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-slate-700 p-4 sm:p-6">
              {/* Título Principal */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                  <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    Panel Admin
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-slate-300">
                  Gestiona tus productos y precios
                </p>
              </div>

              {/* Botones de Acción - Organizados en Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  href="/catalogo"
                  className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 touch-manipulation"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Ver Catálogo Público
                </Link>

                <button
                  onClick={() => setShowChangePasswordModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 touch-manipulation"
                >
                  <Key className="w-4 h-4" />
                  Cambiar Contraseña
                </button>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 touch-manipulation"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Add Product Button & Print Button */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowModal(true);
              }}
              className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 sm:px-6 rounded-lg transition-colors inline-flex items-center justify-center gap-2 touch-manipulation"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">
                Agregar Nuevo Producto
              </span>
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 md:flex-none bg-blue-600 hover:bg-slate-600 text-white font-semibold py-3 px-5 sm:px-6 rounded-lg transition-colors inline-flex items-center justify-center gap-2 touch-manipulation"
            >
              <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">
                Imprimir Lista de Precios
              </span>
            </button>
          </div>

          {/* Filters */}
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
              {(searchTerm ||
                selectedCategory !== "Todas" ||
                sortBy !== "date-desc") && (
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

          {/* Products List */}
          {isLoading ? (
            <div className="text-center py-12 sm:py-20">
              <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-slate-700 border-t-blue-500 mb-3 sm:mb-4"></div>
              <p className="text-slate-300 text-base sm:text-lg font-medium">
                Cargando productos...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-md border border-slate-700">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-slate-300 text-lg font-medium">
                {searchTerm || selectedCategory !== "Todas"
                  ? "No se encontraron productos con esos filtros"
                  : "No hay productos disponibles"}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3 sm:mb-6">
                <p className="text-xs sm:text-sm font-medium text-slate-400 px-1">
                  Mostrando {filteredProducts.length} producto
                  {filteredProducts.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={(product) => {
                      setEditingProduct(product);
                      setShowModal(true);
                    }}
                    onDelete={handleDeleteProduct}
                    onAddToCart={handleAddToCart}
                    readOnly={false}
                  />
                ))}
              </div>
            </>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center p-0 sm:p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-none sm:rounded-xl shadow-2xl w-full sm:max-w-2xl min-h-screen sm:min-h-0 sm:max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center z-10">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {editingProduct
                      ? "Editar Producto"
                      : "Agregar Nuevo Producto"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingProduct(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 touch-manipulation"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
                <div className="p-4 sm:p-6">
                  <ProductForm
                    product={editingProduct}
                    onSubmit={
                      editingProduct ? handleUpdateProduct : handleAddProduct
                    }
                    onCancel={() => {
                      setShowModal(false);
                      setEditingProduct(null);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

        {/* Modal de Cambio de Contraseña */}
        {showChangePasswordModal && (
          <ChangePasswordModal
            onClose={() => setShowChangePasswordModal(false)}
          />
        )}

        {/* Botón flotante de calculadora */}
        <button
          onClick={() => setShowCalculator(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-30"
          title="Abrir Calculadora"
        >
          <Calculator className="w-6 h-6" />
        </button>

        {/* Componente de calculadora */}
        <ShoppingCalculator
          ref={calculatorRef}
          products={products}
          isOpen={showCalculator}
          onClose={() => setShowCalculator(false)}
        />
      </div>
    </div>

    {/* Componente de impresión (fuera del contenedor principal) */}
    <PrintableProductList products={filteredProducts} showCategories={true} />
  </>
  );
}