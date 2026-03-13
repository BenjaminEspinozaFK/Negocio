# Provisiones Mily

Aplicación web para la gestión de productos y catálogo público de **Provisiones Mily**, construida con Next.js, Prisma y Tailwind CSS.

---

## Roles

| Rol | Descripción |
|-----|-------------|
| **Visitante** | Navega el catálogo público de productos con filtros, búsqueda y ordenamiento. |
| **Administrador** | Accede al panel protegido por contraseña para gestionar productos y ventas. |

---

## Catálogo Público (`/catalogo`)

- Listado de todos los productos con imagen, nombre, precio, unidad y categoría.
- **Búsqueda** en tiempo real por nombre de producto.
- **Filtro por categoría**: Frutas y Verduras, Bebidas, Fiambrería, Limpieza, Congelados, Otros.
- **Ordenamiento**: por nombre (A-Z / Z-A), precio (menor / mayor) o más recientes.
- Diseño responsive optimizado para móvil y escritorio.

---

## Panel de Administración (`/admin`)

### Autenticación

- Login con contraseña protegida (hash bcrypt).
- Sesión basada en cookies HTTP-only.
- Cierre de sesión manual.
- Protección con rate-limiting contra ataques de fuerza bruta.

### Gestión de Productos (CRUD)

- **Crear** producto: nombre, precio, categoría, unidad (kg, unidad, paquete, litro) e imagen.
- **Editar** producto existente desde el mismo formulario.
- **Eliminar** producto con diálogo de confirmación.
- Soporte de imagen por URL o carga en base64.
- Validación de datos en frontend y backend.

### Calculadora de Compras

- Panel lateral tipo carrito de compras.
- Buscar y agregar productos al carrito directamente desde las tarjetas o desde la calculadora.
- Ajustar cantidades (sumar / restar / eliminar).
- **Total automático** de la compra.
- **Cálculo de vuelto**: ingresar monto de pago y ver el cambio.
- **Denominaciones rápidas**: botones de billetes chilenos ($1.000 – $20.000).
- Vaciar carrito con confirmación.

### Impresión de Lista de Precios

- Genera una lista de precios imprimible agrupada por categoría.
- Incluye fecha de actualización y total de productos.
- Formato de tabla limpio optimizado para impresión (`window.print()`).

### Cambio de Contraseña

- Modal dedicado para cambiar la contraseña del administrador.
- Requiere contraseña actual + nueva contraseña + confirmación.
- Indicador visual de fuerza de la contraseña (débil / media / fuerte).
- Validación mínima de 6 caracteres.

---

## Tech Stack

| Tecnología | Uso |
|---|---|
| **Next.js 16** | Framework (App Router + Turbopack) |
| **TypeScript** | Tipado estático |
| **Prisma ORM** | Acceso a base de datos |
| **Tailwind CSS 4** | Estilos utilitarios |
| **Radix UI** | Componentes accesibles (Select, AlertDialog, etc.) |
| **Lucide Icons** | Iconografía |
| **bcryptjs** | Hash de contraseñas |
| **Sonner** | Notificaciones toast |

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx                  # Página principal
│   ├── catalogo/                 # Catálogo público
│   ├── admin/                    # Panel de administración
│   └── api/
│       ├── auth/                 # Login, logout, cambio de contraseña
│       └── products/             # CRUD de productos (REST)
├── components/                   # Componentes reutilizables
├── lib/                          # Utilidades (auth, prisma, validaciones)
└── types/                        # Tipos TypeScript
```
