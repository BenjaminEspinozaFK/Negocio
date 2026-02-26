"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import { Product } from "@/types/product";
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Calculator,
  AlertTriangle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CartItem {
  product: Product;
  quantity: number;
}

interface ShoppingCalculatorProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}

export interface ShoppingCalculatorRef {
  addToCart: (product: Product) => void;
}

const ShoppingCalculator = forwardRef<
  ShoppingCalculatorRef,
  ShoppingCalculatorProps
>(({ products, isOpen, onClose }, ref) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [showClearAlert, setShowClearAlert] = useState(false);
  // Filtrar productos por búsqueda
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Agregar producto al carrito
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    setSearchTerm(""); // Limpiar búsqueda después de agregar
  };

  // Exponer la función addToCart a través del ref
  useImperativeHandle(ref, () => ({
    addToCart,
  }));

  // Aumentar cantidad
  const increaseQuantity = (productId: string) => {
    setCart(
      cart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  // Disminuir cantidad
  const decreaseQuantity = (productId: string) => {
    setCart(
      cart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    );
  };

  // Eliminar del carrito
  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  // Limpiar carrito
  const clearCart = () => {
    setCart([]);
    setPaymentAmount("");
    setShowClearAlert(false);
  };

  // Calcular total
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  // Calcular vuelto
  const payment = parseFloat(paymentAmount) || 0;
  const change = payment - total;

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  // Manejar cambios en el monto de pago
  const handlePaymentChange = (value: string) => {
    // Solo permitir números
    const numericValue = value.replace(/[^0-9]/g, "");
    setPaymentAmount(numericValue);
  };

  // Establecer denominación rápida
  const setQuickAmount = (amount: number) => {
    setPaymentAmount(amount.toString());
  };

  // Denominaciones de billetes chilenos
  const denominations = [1000, 2000, 5000, 10000, 20000];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel lateral */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-slate-800 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Calculadora</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Búsqueda de productos */}
        <div className="p-4 border-b border-slate-700">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar producto para agregar..."
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Lista de productos filtrados */}
          {searchTerm && (
            <div className="mt-2 max-h-40 overflow-y-auto bg-slate-700 rounded-lg border border-slate-600">
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 5).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="w-full px-3 py-2 text-left hover:bg-slate-600 transition-colors border-b border-slate-600 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white">{product.name}</span>
                      <span className="text-xs text-blue-400 font-semibold">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-slate-400">
                  No se encontraron productos
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lista del carrito */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <ShoppingCart className="w-16 h-16 mb-3 opacity-50" />
              <p className="text-sm">No hay productos agregados</p>
              <p className="text-xs mt-1">Busca y agrega productos arriba</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-slate-700 rounded-lg p-3 border border-slate-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {formatPrice(item.product.price)} c/u
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(item.product.id)}
                        className="bg-slate-600 hover:bg-slate-500 text-white w-7 h-7 rounded flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.product.id)}
                        className="bg-slate-600 hover:bg-slate-500 text-white w-7 h-7 rounded flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Subtotal</p>
                      <p className="text-sm font-bold text-blue-400">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con total */}
        <div className="bg-slate-900 p-4 border-t border-slate-700">
          {cart.length > 0 && (
            <button
              onClick={() => setShowClearAlert(true)}
              className="w-full mb-3 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Limpiar todo
            </button>
          )}

          <div className="bg-slate-700 rounded-lg p-4 mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 text-sm">Productos:</span>
              <span className="text-white font-semibold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-600">
              <span className="text-lg font-bold text-white">TOTAL:</span>
              <span className="text-2xl font-bold text-blue-400">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          {/* Campo de pago y vuelto */}
          {cart.length > 0 && (
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="mb-3">
                <label className="block text-sm text-slate-300 mb-2">
                  Pago del cliente:
                </label>

                {/* Botones de denominaciones rápidas */}
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {denominations.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setQuickAmount(amount)}
                      className="px-2 py-1.5 bg-slate-600 hover:bg-blue-600 text-white text-xs font-semibold rounded transition-colors border border-slate-500 hover:border-blue-500"
                    >
                      ${(amount / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  value={paymentAmount}
                  onChange={(e) => handlePaymentChange(e.target.value)}
                  placeholder="Ej: 20000"
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Mostrar vuelto */}
              {payment > 0 && (
                <div className="pt-3 border-t border-slate-600">
                  {payment >= total ? (
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-white">
                        Vuelto:
                      </span>
                      <span className="text-2xl font-bold text-green-400">
                        {formatPrice(change)}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-red-400">
                        El pago es insuficiente
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Faltan {formatPrice(total - payment)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Alert Dialog para confirmar limpieza */}
      <AlertDialog open={showClearAlert} onOpenChange={setShowClearAlert}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              ¿Limpiar toda la calculadora?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Esta acción eliminará todos los productos del carrito y reiniciará
              el monto de pago. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-white hover:bg-slate-600 border-slate-600">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={clearCart}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Limpiar todo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

ShoppingCalculator.displayName = "ShoppingCalculator";

export default ShoppingCalculator;
