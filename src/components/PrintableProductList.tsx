"use client";

import { Product } from "@/types/product";

interface PrintableProductListProps {
  products: Product[];
  showCategories?: boolean;
}
export default function PrintableProductList({
  products,
  showCategories = true,
}: PrintableProductListProps) {
  // Agrupar productos por categoría
  const productsByCategory = products.reduce(
    (acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );

  const categories = Object.keys(productsByCategory).sort();

  //Formatear precio a CLP
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  return (
    <div id="printable-area" className="hidden print:block">
      {/* Header de la lista */}
      <div className="text-center mb-8 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold mb-2">Lista de Precios</h1>
        <p className="text-sm text-gray-600">
          Actualizado:{" "}
          {new Date().toLocaleDateString("es-CL", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Total de productos: {products.length}
        </p>
      </div>

      {/* Lista de productos */}
      {showCategories ? (
        // Vista agrupada por categorías
        categories.map((category) => (
          <div key={category} className="mb-6">
            <h2 className="text-xl font-bold mb-3 bg-gray-100 px-3 py-2 border-l-4 border-black">
              {category}
            </h2>
            <table className="w-full mb-4">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2 px-2 font-semibold">
                    Producto
                  </th>
                  <th className="text-center py-2 px-2 font-semibold">
                    Unidad
                  </th>
                  <th className="text-right py-2 px-2 font-semibold">Precio</th>
                </tr>
              </thead>
              <tbody>
                {productsByCategory[category]
                  .sort((a, b) => a.name.localeCompare(b.name, "es"))
                  .map((product) => (
                    <tr key={product.id} className="border-b border-gray-200">
                      <td className="py-2 px-2">{product.name}</td>
                      <td className="text-center py-2 px-2 text-sm text-gray-600">
                        {product.unit}
                      </td>
                      <td className="text-right py-2 px-2 font-semibold">
                        {formatPrice(product.price)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        // Vista simple sin categorías
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 px-2 font-semibold">Producto</th>
              <th className="text-center py-2 px-2 font-semibold">Categoría</th>
              <th className="text-center py-2 px-2 font-semibold">Unidad</th>
              <th className="text-right py-2 px-2 font-semibold">Precio</th>
            </tr>
          </thead>
          <tbody>
            {products
              .sort((a, b) => a.name.localeCompare(b.name, "es"))
              .map((product) => (
                <tr key={product.id} className="border-b border-gray-200">
                  <td className="py-2 px-2">{product.name}</td>
                  <td className="text-center py-2 px-2 text-sm text-gray-600">
                    {product.category}
                  </td>
                  <td className="text-center py-2 px-2 text-sm text-gray-600">
                    {product.unit}
                  </td>
                  <td className="text-right py-2 px-2 font-semibold">
                    {formatPrice(product.price)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t-2 border-black text-center text-xs text-gray-500">
        <p>Precios sujetos a cambio sin previo aviso</p>
      </div>
    </div>
  );
}
