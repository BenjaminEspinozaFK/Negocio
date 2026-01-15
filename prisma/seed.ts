import { PrismaClient } from '@prisma/client'
import productsData from '../src/data/products.json'

const prisma = new PrismaClient()

interface ProductJson {
  id: string
  name: string
  category: string
  price: number
  unit: string
  image?: string
}

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes
  await prisma.product.deleteMany()
  console.log('✅ Productos existentes eliminados')

  // Insertar productos del JSON
  const products = productsData as ProductJson[]
  
  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        unit: product.unit,
        image: product.image,
      },
    })
  }

  console.log(`✅ ${products.length} productos insertados correctamente`)
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
