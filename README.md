# Provisiones Mily

Aplicación web para la gestión de productos y catálogo público de **Provisiones Mily**, construida con Next.js, Prisma y Tailwind CSS.

---

## Roles

| Rol | Descripción |
|-----|-------------|
| **Visitante** | Puede ver el catálogo público de productos con filtros, búsqueda y ordenamiento. |
| **Administrador** | Accede al panel de administración mediante login con contraseña para gestionar los productos. |

---

## Funciones del Administrador

- Iniciar sesión con autenticación segura (contraseña hasheada con bcrypt).
- Crear, editar y eliminar productos (nombre, precio, categoría, imagen).
- Cambiar su contraseña desde el panel.
- Visualizar e imprimir la lista completa de productos.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Base de datos:** Prisma ORM
- **Estilos:** Tailwind CSS 4
- **UI:** Radix UI + Lucide Icons
- **Lenguaje:** TypeScript
