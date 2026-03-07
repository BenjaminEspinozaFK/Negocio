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
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          🏪 Provisiones Mily
        </h1>
        <p className="text-slate-300">Cargando...</p>
      </div>
    </div>
  );
}
