/**
 * Utilidades para validación de contraseñas
 */

export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
    strength: number;
}

/**
 * Valida la fortaleza de una contraseña
 * @param password - Contraseña a validar
 * @returns Resultado de la validación con errores y nivel de fuerza (0-5)
 */
export function validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];
    let strength = 0;

    // Validaciones básicas
    if (!password) {
        errors.push("La contraseña es requerida");
        return { isValid: false, errors, strength: 0 };
    }

    if (password.length < 8) {
        errors.push("La contraseña debe tener al menos 8 caracteres");
    } else {
        strength++;
    }

    if (!/[a-z]/.test(password)) {
        errors.push("Debe incluir al menos una letra minúscula");
    } else {
        strength++;
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("Debe incluir al menos una letra mayúscula");
    } else {
        strength++;
    }

    if (!/[0-9]/.test(password)) {
        errors.push("Debe incluir al menos un número");
    } else {
        strength++;
    }

    // Bonus por caracteres especiales
    if (/[^A-Za-z0-9]/.test(password)) {
        strength++;
    }

    const isValid = errors.length === 0 && strength >= 4;

    return { isValid, errors, strength };
}

/**
 * Calcula solo el nivel de fuerza de una contraseña
 * @param password - Contraseña a evaluar
 * @returns Nivel de fuerza (0-5)
 */
export function getPasswordStrength(password: string): number {
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
}

/**
 * Obtiene etiquetas descriptivas para el nivel de fuerza
 * @param strength - Nivel de fuerza (0-5)
 * @returns Etiqueta descriptiva
 */
export function getStrengthLabel(strength: number): string {
    const labels = ["", "Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"];
    return labels[strength] || "";
}

/**
 * Obtiene colores para el indicador visual de fuerza
 * @param strength - Nivel de fuerza (0-5)
 * @returns Clase de Tailwind para el color
 */
export function getStrengthColor(strength: number): string {
    const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-green-600"];
    return colors[strength] || "";
}
