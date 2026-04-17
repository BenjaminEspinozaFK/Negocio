import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { Settings } from "@prisma/client";

export async function getOrCreateAdminSettings(): Promise<Settings> {
  const existing = await prisma.settings.findUnique({
    where: { id: "admin-config" },
  });

  if (existing) return existing;

  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envPassword) {
    throw new Error("ADMIN_PASSWORD no está definida en las variables de entorno");
  }

  const hashedPassword = await bcrypt.hash(envPassword, 10);
  return prisma.settings.create({
    data: { id: "admin-config", password: hashedPassword },
  });
}
