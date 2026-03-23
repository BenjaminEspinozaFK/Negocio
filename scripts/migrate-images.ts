import { prisma } from "../src/lib/prisma";
import { uploadImage } from "../src/lib/cloudinary";

async function migrate() {
    const products = await prisma.product.findMany({
        where: { image: { startsWith: "data:" } },
    });

    console.log(`Migrando ${products.length} productos...`);

    for (const product of products) {
        if (product.image?.startsWith("data:")) {
            const url = await uploadImage(product.image);
            await prisma.product.update({
                where: { id: product.id },
                data: { image: url },
            });
            console.log(`✓ ${product.name}`);
        }
    }

    console.log("Migración completada");
}

migrate();