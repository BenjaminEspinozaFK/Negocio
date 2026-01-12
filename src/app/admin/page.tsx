"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import ProductForm from "@/components/ProductForm";
import { Product, categories } from "@/types/product";
import Link from "next/link";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Verificar si ya está autenticado en la sesión
    const auth = sessionStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchProducts();
    } else {
      setIsLoading(false);
    }
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
        setError("❌ Contraseña incorrecta");
        setPassword("");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError("❌ Error al verificar contraseña");
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
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Error al agregar el producto");
    }
  };

  const handleUpdateProduct = async (product: Omit<Product, "id">) => {
    if (!editingProduct) return;

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        fetchProducts();
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("Error al actualizar el producto");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar el producto");
    }
  };

  // Pantalla de Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full border border-gray-100">
          <div className="text-center mb-8">
            <div className="bg-linear-to-r from-blue-500 to-indigo-500 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg mb-4 mx-auto">
              🔒
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-600">
              Ingresa la contraseña para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200 hover:border-gray-400"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              🔓 Ingresar
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/catalogo"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ← Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Panel de Admin (después de autenticarse)
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header con logout */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-6 bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 border border-purple-100">
            <Link
              href="/catalogo"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-2 hover:gap-3 duration-200"
            >
              ← Ver catálogo público
            </Link>
            <button
              onClick={handleLogout}
              className="bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              🚪 Cerrar Sesión
            </button>
          </div>

          <div className="inline-block bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 border border-purple-100">
            <div className="text-6xl mb-4">🔧</div>
            <h1 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Panel de Administración
            </h1>
            <p className="text-gray-600 text-lg">
              Gestiona tus productos y precios
            </p>
          </div>
        </div>

        {/* Formulario */}
        <ProductForm
          key={editingProduct?.id || "new"}
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onCancel={() => setEditingProduct(null)}
        />

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-200 p-6 mb-8 hover:shadow-2xl transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Buscar Producto
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Escribe el nombre del producto..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200 hover:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📂 Filtrar por Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200 hover:border-gray-400 bg-white"
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
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">
              {searchTerm || selectedCategory !== "Todas"
                ? "No se encontraron productos con esos filtros"
                : "No hay productos. ¡Agrega tu primer producto!"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 inline-block bg-linear-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl shadow-md font-semibold">
              📦 {filteredProducts.length} producto
              {filteredProducts.length !== 1 ? "s" : ""} encontrado
              {filteredProducts.length !== 1 ? "s" : ""}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={setEditingProduct}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
