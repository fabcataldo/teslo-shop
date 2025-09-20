import { prisma } from '../lib/prisma';
import { initialData } from './seed';
import { countries } from './seed-countries';

async function main() {

    //1. Borrar registros previos
    // si estoy trabajando solo creando la bd para dev, comento el
    // await Promise.all([.... y pongo await a cada una de las 3 instrucciones
    await Promise.all([
        prisma.userAddress.deleteMany(),
        prisma.user.deleteMany(),
        prisma.productImage.deleteMany(),
        prisma.product.deleteMany(),
        prisma.category.deleteMany(),
        prisma.country.deleteMany()
    ]);

    const {categories, products, users } = initialData;

    await prisma.user.createMany({
        data: users
    });

    //categorias
    const categoriesData = categories.map(category => ({
        name: category
    }));
    await prisma.category.createMany({
        data: categoriesData
    });

    const categoriesDB = await prisma.category.findMany();
    const categoriesMap = categoriesDB.reduce((map, category) => {
        map[category.name.toLowerCase()] = category.id;
        return map;
    }, {} as Record<string, string>);

    products.forEach(async (product) => {
    const { type, images, ...rest } = product;

    const dbProduct = await prisma.product.create({
        data: {
            ...rest,
            categoryId: categoriesMap[type]
        }
    });

    const imagesData = images.map(image => ({
        url: image,
        productId: dbProduct.id
    }));

        await prisma.productImage.createMany({
            data: imagesData
        });
    });

    await prisma.country.createMany({
        data: countries
    });
     

    console.log('Seed ejecutado correctamente');
}

(() => {
    if (process.env.NODE_ENV === 'production') return;

    main();
})();