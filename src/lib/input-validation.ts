/**
 * Utilidades para sanitización y validación de inputs
 * Previene ataques XSS y valida datos de entrada
 */

/**
 * Sanitiza una cadena de texto removiendo HTML y scripts peligrosos
 * @param input - Texto a sanitizar
 * @returns Texto sanitizado
 */
export function sanitizeString(input: string): string {
    if (!input) return "";

    return input
        .replace(/[<>]/g, "") // Remover < y >
        .replace(/javascript:/gi, "") // Remover javascript:
        .replace(/on\w+\s*=/gi, "") // Remover event handlers (onclick, onload, etc)
        .trim();
}

/**
 * Valida y sanitiza un nombre de producto
 * @param name - Nombre a validar
 * @returns Objeto con isValid y valor sanitizado
 */
export function validateProductName(name: string): {
    isValid: boolean;
    value: string;
    error?: string;
} {
    const sanitized = sanitizeString(name);

    if (!sanitized || sanitized.length < 2) {
        return {
            isValid: false,
            value: sanitized,
            error: "El nombre debe tener al menos 2 caracteres",
        };
    }

    if (sanitized.length > 100) {
        return {
            isValid: false,
            value: sanitized,
            error: "El nombre no puede exceder 100 caracteres",
        };
    }

    // Validar que solo contenga caracteres permitidos
    const validPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-.,()&]+$/;
    if (!validPattern.test(sanitized)) {
        return {
            isValid: false,
            value: sanitized,
            error: "El nombre contiene caracteres no permitidos",
        };
    }

    return {
        isValid: true,
        value: sanitized,
    };
}

/**
 * Valida un precio
 * @param price - Precio a validar
 * @returns Objeto con isValid y error si aplica
 */
export function validatePrice(price: number): {
    isValid: boolean;
    error?: string;
} {
    if (isNaN(price)) {
        return {
            isValid: false,
            error: "El precio debe ser un número válido",
        };
    }

    if (price <= 0) {
        return {
            isValid: false,
            error: "El precio debe ser mayor a 0",
        };
    }

    if (price > 999999999) {
        return {
            isValid: false,
            error: "El precio es demasiado alto",
        };
    }

    return { isValid: true };
}

/**
 * Valida una categoría contra una lista permitida
 * @param category - Categoría a validar
 * @param allowedCategories - Lista de categorías permitidas
 * @returns Objeto con isValid y error si aplica
 */
export function validateCategory(
    category: string,
    allowedCategories: string[]
): {
    isValid: boolean;
    error?: string;
} {
    if (!allowedCategories.includes(category)) {
        return {
            isValid: false,
            error: "Categoría no válida",
        };
    }

    return { isValid: true };
}

/**
 * Valida una unidad contra una lista permitida
 * @param unit - Unidad a validar
 * @param allowedUnits - Lista de unidades permitidas
 * @returns Objeto con isValid y error si aplica
 */
export function validateUnit(
    unit: string,
    allowedUnits: string[]
): {
    isValid: boolean;
    error?: string;
} {
    if (!allowedUnits.includes(unit)) {
        return {
            isValid: false,
            error: "Unidad no válida",
        };
    }

    return { isValid: true };
}

/**
 * Valida una imagen en base64
 * @param imageBase64 - String en base64 de la imagen
 * @returns Objeto con isValid y error si aplica
 */
export function validateImageBase64(imageBase64: string): {
    isValid: boolean;
    error?: string;
} {
    if (!imageBase64) {
        return { isValid: true }; // Imagen opcional
    }

    // Verificar que sea un formato base64 válido
    if (!imageBase64.startsWith("data:image/")) {
        return {
            isValid: false,
            error: "Formato de imagen no válido",
        };
    }

    // Verificar tamaño aproximado (3MB en base64)
    const sizeInBytes = (imageBase64.length * 3) / 4;
    const maxSize = 3 * 1024 * 1024; // 3MB

    if (sizeInBytes > maxSize) {
        return {
            isValid: false,
            error: "La imagen es demasiado grande (máximo 3MB)",
        };
    }

    return { isValid: true };
}

/**
 * Escapa caracteres especiales para prevenir SQL injection
 * (Nota: Prisma ya hace esto automáticamente, pero es buena práctica)
 * @param input - String a escapar
 * @returns String escapado
 */
export function escapeSQL(input: string): string {
    if (!input) return "";
    return input.replace(/['";\\]/g, "\\$&");
}
