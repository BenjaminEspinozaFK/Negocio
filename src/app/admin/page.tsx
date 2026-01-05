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

  // Contraseña del admin (puedes cambiarla aquí)
  const ADMIN_PASSWORD = "admin123";

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      setError("");
      fetchProducts();
    } else {
      setError("❌ Contraseña incorrecta");
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
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🔒 Panel de Administración
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
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors"
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

          <div className="mt-4 text-center text-xs text-gray-500">
            <p>
              Contraseña por defecto:{" "}
              <code className="bg-gray-200 px-2 py-1 rounded">admin123</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Panel de Admin (después de autenticarse)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header con logout */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link
              href="/catalogo"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ← Ver catálogo público
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              🚪 Cerrar Sesión
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            🔧 Panel de Administración
          </h1>
          <p className="text-gray-600 text-lg">
            Gestiona tus productos y precios
          </p>
        </div>

        {/* Formulario */}
        <ProductForm
          key={editingProduct?.id || 'new'}
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onCancel={() => setEditingProduct(null)}
        />

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📂 Filtrar por Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="mb-4 text-gray-700 font-medium">
              📦 {filteredProducts.length} producto
              {filteredProducts.length !== 1 ? "s" : ""} encontrado
              {filteredProducts.length !== 1 ? "s" : ""}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
