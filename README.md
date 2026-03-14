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

### Características Principales

- **Listado de Productos**: Visualiza todos los productos disponibles con imagen, nombre, precio, unidad y categoría.
- **Interfaz Responsive**: Diseño completamente adaptable para móviles, tablets y escritorio con navegación intuitiva.

### Filtros y Búsqueda

- **Búsqueda en Tiempo Real**: Filtra productos por nombre mientras escribes, sin necesidad de recargar la página.
- **Filtro por Categoría**:
  - Frutas y Verduras
  - Bebidas
  - Fiambrería
  - Limpieza
  - Congelados
  - Otros
- **Combinación de Filtros**: Combina búsqueda y categoría simultáneamente para resultados precisos.

### Opciones de Ordenamiento

- **Por Nombre**:
  - A-Z (alfabético ascendente)
  - Z-A (alfabético descendente)
- **Por Precio**:
  - Menor a Mayor (precios más bajos primero)
  - Mayor a Menor (precios más altos primero)
- **Más Recientes**: Muestra los productos recientemente añadidos primero.

### Experiencia de Usuario

- **Animaciones Suaves**: Transiciones visuales fluidas al aplicar filtros.
- **Acceso a Panel Admin**: Botón de acceso rápido al panel de administración en la esquina superior derecha.
- **Información Completa**: Cada producto muestra precio, unidad de medida y categoría claramente.
- **Revalidación Automática**: Los datos se actualizan automáticamente cada 60 segundos para mostrar cambios en tiempo real.

---

## Panel de Administración (`/admin`)

### Autenticación

- **Login Seguro**: Acceso protegido con contraseña mediante hash bcrypt.
- **Sesiones Seguras**: Basadas en cookies HTTP-only para máxima seguridad.
- **Protección Anti-Fuerza Bruta**: Rate-limiting para prevenir intentos masivos de acceso.
- **Cierre de Sesión**: Control manual de sesión con logout rápido.

### Gestión de Productos (CRUD Completo)

#### Crear Producto
- Formulario completo con validación en frontend y backend.
- Campos: nombre, precio, categoría, unidad (kg, unidad, paquete, litro) e imagen.
- Soporte de imagen por URL o carga en base64.

#### Editar Producto
- Edición directa desde el mismo formulario de creación.
- Cambio de cualquier parámetro del producto.
- Actualización inmediata en la base de datos.

#### Eliminar Producto
- Confirmación mediante diálogo preventivo.
- Eliminación segura de la base de datos.

#### Visualización
- Lista actualizada en tiempo real de todos los productos.
- Acceso rápido a editar o eliminar desde cada tarjeta de producto.

### Calculadora de Compras (Panel Lateral)

Un carrito de compras interactivo con cálculos automáticos:

- **Buscar y Agregar**: Busca productos y agrégalos al carrito directamente.
- **Gestión de Cantidades**: 
  - Aumentar/disminuir cantidad de cada producto.
  - Eliminar productos individuales del carrito.
- **Total Automático**: Cálculo instantáneo del total de la compra.
- **Cálculo de Vuelto**: 
  - Ingresa el monto recibido del cliente.
  - Visualiza automáticamente el cambio a entregar.
- **Denominaciones Rápidas**: Botones preestablecidos para billetes chilenos ($1.000, $2.000, $5.000, $10.000, $20.000).
- **Vaciar Carrito**: Borrar todos los productos con confirmación.

### Impresión de Lista de Precios

- **Generación de Lista Imprimible**: Crea un documento formateado para impresión.
- **Organización por Categoría**: Los productos se agrupan automáticamente por su categoría.
- **Información Completa**: Incluye nombre, precio, unidad y categoría de cada producto.
- **Metadata**: Fecha de actualización y total de productos listados.
- **Formato Limpio**: Tabla optimizada para impresión con estilos adecuados.
- **Uso Fácil**: Un clic con `window.print()` para imprimir directamente.

### Cambio de Contraseña

- **Modal Dedicado**: Interfaz segura y dedicada para cambiar contraseña.
- **Validación Completa**:
  - Requiere contraseña actual (verificación de identidad).
  - Nueva contraseña + confirmación (evita errores de tipeo).
  - Mínimo 6 caracteres.
- **Indicador Visual de Fuerza**: 
  - Débil: contraseña muy simple.
  - Media: contraseña moderada.
  - Fuerte: contraseña segura.
- **Seguridad**: Se valida en backend con hash bcrypt.

---

## API REST

### Autenticación (`/api/auth`)

- **POST `/api/auth/login`**: Inicia sesión con contraseña.
- **POST `/api/auth/logout`**: Cierra la sesión actual.
- **POST `/api/auth/change-password`**: Cambia la contraseña del administrador.

### Productos (`/api/products`)

- **GET `/api/products`**: Obtiene todos los productos.
- **POST `/api/products`**: Crea un nuevo producto (requiere autenticación).
- **PUT `/api/products/[id]`**: Actualiza un producto existente (requiere autenticación).
- **DELETE `/api/products/[id]`**: Elimina un producto (requiere autenticación).

---

## Instalación y Configuración

### Requisitos Previos

- Node.js 18+ y npm/yarn
- Base de datos PostgreSQL (o similar configurada en Prisma)
- Variables de entorno configuradas

### Compilación para Producción

```bash
npm run build
npm run start
```

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

---

## Características Destacadas

✅ **Seguridad**: Autenticación con hash bcrypt, sesiones HTTP-only, rate-limiting contra ataques.

✅ **Performance**: Next.js con Turbopack, revalidación ISR cada 60 segundos, carga eficiente.

✅ **Responsivo**: Diseño mobile-first adaptable a todos los dispositivos.

✅ **UX Intuitiva**: Filtros fluidos, búsqueda en tiempo real, animaciones suaves.

✅ **Funcionalidad Completa**: CRUD de productos, carrito de compras, generación de reportes (lista de precios).

✅ **Validación Robusta**: Frontend y backend, prevención de datos inválidos.

✅ **Fácil de Mantener**: Código TypeScript tipado, componentes reutilizables, estructura clara.

---

## Licencia

Proyecto privado de **Provisiones Mily**
