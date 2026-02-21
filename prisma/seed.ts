import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed script ejecutado correctamente')
  console.log('ℹ️  No hay datos de semilla para insertar')
  console.log('💡 Los productos se gestionan desde el panel de administración')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
