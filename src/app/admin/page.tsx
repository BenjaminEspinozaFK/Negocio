"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/ProductCard";
import ProductForm from "@/components/ProductForm";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { Product, categories } from "@/types/product";
import Link from "next/link";
import PrintableProductList from "@/components/PrintableProductList";
import ShoppingCalculator, {
  ShoppingCalculatorRef,
} from "@/components/ShoppingCalculator";
import { toast } from "sonner";
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
  Printer,
  Calculator,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    // Siempre mostrar pantalla de login al entrar
    setIsLoading(false);
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

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        fetchProducts();
      } else {
        // Mostrar el mensaje de error específico del servidor
        setError(data.error || "Contraseña incorrecta");
        setPassword("");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error al verificar contraseña");
      setPassword("");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }

    setIsAuthenticated(false);
    setPassword("");
    toast.info("👋 Sesión cerrada");
  };
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) {
        throw new Error("Error al cargar productos");
      }
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      toast.error("❌ Error al cargar los productos");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (product: Omit<Product, "id">) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Incluir cookies de sesión
        body: JSON.stringify(product),
      });

      if (response.ok) {
        await fetchProducts();
        setShowModal(false);
        toast.success("✅ Producto agregado exitosamente");
      } else {
        toast.error("❌ Error al agregar producto");
      }
    } catch {
      toast.error("❌ Error al conectar con el servidor");
    }
  };

  const handleUpdateProduct = async (product: Omit<Product, "id">) => {
    if (!editingProduct) return;

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Incluir cookies de sesión
        body: JSON.stringify({
          id: editingProduct.id,
          ...product,
        }),
      });

      if (response.ok) {
        await fetchProducts();
        setEditingProduct(null);
        setShowModal(false);
        toast.success("✅ Producto actualizado exitosamente");
      } else {
        toast.error("❌ Error al actualizar producto");
      }
    } catch {
      toast.error("❌ Error al conectar con el servidor");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include", // Incluir cookies de sesión
      });

      if (response.ok) {
        await fetchProducts();
        toast.success("✅ Producto eliminado exitosamente");
      } else {
        toast.error("❌ Error al eliminar producto");
      }
    } catch {
      toast.error("❌ Error al conectar con el servidor");
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
      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700 p-8 sm:p-10 max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Logo/Icono con animación */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Lock className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Panel de Administración
            </h1>
            <p className="text-sm sm:text-base text-slate-400">
              Ingresa la contraseña para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-400" />
                Contraseña
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 pr-12 border-2 border-slate-600 bg-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-base transition-all duration-200 group-hover:border-slate-500 placeholder:text-slate-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors p-1.5 hover:bg-slate-600 rounded-lg"
                  tabIndex={-1}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border-2 border-red-500/50 px-4 py-3.5 rounded-xl text-sm flex items-center gap-3 shadow-sm animate-in slide-in-from-top-2 duration-300 backdrop-blur-sm">
                <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-red-200 font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              <span>Ingresar</span>
              <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-2 text-slate-500">o</span>
            </div>
          </div>

          {/* Link al catálogo */}
          <div className="text-center">
            <Link
              href="/catalogo"
              className="text-sm text-slate-400 hover:text-blue-400 inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Volver al catálogo</span>
            </Link>
          </div>

          {/* Footer decorativo */}
          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <p className="text-xs text-slate-500">
              🔒 Conexión segura • Provisiones Mily
            </p>
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
          <div className="mb-4 sm:mb-8 animate-fadeIn">
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-slate-700 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
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
                  className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center justify-center gap-2 touch-manipulation hover:scale-105 ripple-effect"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Ver Catálogo Público
                </Link>

                <button
                  onClick={() => setShowChangePasswordModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center justify-center gap-2 touch-manipulation hover:scale-105 ripple-effect"
                >
                  <Key className="w-4 h-4" />
                  Cambiar Contraseña
                </button>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center justify-center gap-2 touch-manipulation hover:scale-105 ripple-effect"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Add Product Button & Print Button */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 animate-slideDown">
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowModal(true);
              }}
              className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 sm:px-6 rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 touch-manipulation hover:scale-105 ripple-effect"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">
                Agregar Nuevo Producto
              </span>
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 md:flex-none bg-blue-600 hover:bg-slate-600 text-white font-semibold py-3 px-5 sm:px-6 rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 touch-manipulation hover:scale-105 ripple-effect"
            >
              <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">
                Imprimir Lista de Precios
              </span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-md border border-slate-700 p-4 sm:p-6 mb-4 sm:mb-8 animate-slideDown transition-all duration-300 hover:shadow-lg">
            <div className="space-y-4">
              {/* Búsqueda, Categoría y Ordenar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 sm:mb-2 flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                    Buscar Producto
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Escribe el nombre..."
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-600 bg-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-white placeholder:text-slate-400 transition-all duration-300 focus:bg-slate-700"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 sm:mb-2 flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                    Filtrar por Categoría
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-600 bg-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-white cursor-pointer transition-all duration-300 focus:bg-slate-700"
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
                  <label className="text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 sm:mb-2 flex items-center gap-2">
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-600 bg-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-white cursor-pointer transition-all duration-300 focus:bg-slate-700"
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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-md border border-slate-700 animate-fadeIn">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-slate-300 text-lg font-medium">
                {searchTerm || selectedCategory !== "Todas"
                  ? "No se encontraron productos con esos filtros"
                  : "No hay productos disponibles"}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3 sm:mb-6 animate-scaleIn">
                <p className="text-xs sm:text-sm font-medium text-slate-400 px-1">
                  Mostrando {filteredProducts.length} producto
                  {filteredProducts.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      opacity: 0,
                    }}
                    className="animate-slideUp"
                  >
                    <ProductCard
                      product={product}
                      onEdit={(product) => {
                        setEditingProduct(product);
                        setShowModal(true);
                      }}
                      onDelete={handleDeleteProduct}
                      onAddToCart={handleAddToCart}
                      readOnly={false}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center p-0 sm:p-4 z-50 overflow-y-auto animate-fadeIn">
              <div className="bg-white rounded-none sm:rounded-xl shadow-2xl w-full sm:max-w-2xl min-h-screen sm:min-h-0 sm:max-h-[90vh] overflow-y-auto animate-scaleIn">
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
