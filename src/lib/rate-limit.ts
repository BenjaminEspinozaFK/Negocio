import { prisma } from "./prisma";

/**
 * Configuración de rate limiting
 */
const RATE_LIMIT_CONFIG = {
    maxAttempts: 5, // Máximo de intentos fallidos
    windowMinutes: 15, // Ventana de tiempo en minutos
    blockDurationMinutes: 30, // Tiempo de bloqueo después de exceder el límite
};

/**
 * Verifica si una IP está bloqueada por exceso de intentos fallidos
 * @param ipAddress - Dirección IP a verificar
 * @returns true si está bloqueada, false si puede intentar
 */
export async function isRateLimited(ipAddress: string): Promise<boolean> {
    const windowStart = new Date(
        Date.now() - RATE_LIMIT_CONFIG.windowMinutes * 60 * 1000
    );

    // Contar intentos fallidos en la ventana de tiempo
    const failedAttempts = await prisma.loginAttempt.count({
        where: {
            ipAddress,
            success: false,
            timestamp: {
                gte: windowStart,
            },
        },
    });

    return failedAttempts >= RATE_LIMIT_CONFIG.maxAttempts;
}

/**
 * Registra un intento de login en la base de datos
 * @param ipAddress - Dirección IP del cliente
 * @param userAgent - User agent del navegador
 * @param success - Si el intento fue exitoso
 */
export async function logLoginAttempt(
    ipAddress: string | null,
    userAgent: string | null,
    success: boolean
): Promise<void> {
    await prisma.loginAttempt.create({
        data: {
            ipAddress,
            userAgent,
            success,
        },
    });
}

/**
 * Obtiene el tiempo restante de bloqueo para una IP
 * @param ipAddress - Dirección IP a verificar
 * @returns Minutos restantes de bloqueo, o 0 si no está bloqueado
 */
export async function getRemainingBlockTime(
    ipAddress: string
): Promise<number> {
    const windowStart = new Date(
        Date.now() - RATE_LIMIT_CONFIG.windowMinutes * 60 * 1000
    );

    const lastFailedAttempt = await prisma.loginAttempt.findFirst({
        where: {
            ipAddress,
            success: false,
            timestamp: {
                gte: windowStart,
            },
        },
        orderBy: {
            timestamp: "desc",
        },
    });

    if (!lastFailedAttempt) return 0;

    const blockUntil = new Date(
        lastFailedAttempt.timestamp.getTime() +
        RATE_LIMIT_CONFIG.blockDurationMinutes * 60 * 1000
    );

    const remainingMs = blockUntil.getTime() - Date.now();
    return Math.max(0, Math.ceil(remainingMs / 60000));
}

/**
 * Limpia intentos de login antiguos (más de 24 horas)
 * Útil para ejecutar periódicamente y mantener la base de datos limpia
 */
export async function cleanOldLoginAttempts(): Promise<number> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await prisma.loginAttempt.deleteMany({
        where: {
            timestamp: {
                lt: oneDayAgo,
            },
        },
    });

    return result.count;
}
