"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente al catálogo
    router.push("/catalogo");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🏪 Cargando...
        </h1>
        <p className="text-gray-600">Redirigiendo al catálogo</p>
      </div>
    </div>
  );
}
