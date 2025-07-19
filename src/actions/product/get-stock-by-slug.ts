'use server';

import { prisma } from "@/lib/prisma";
// import { sleep } from "@/utils";

export const getStockBySlug = async (slug: string): Promise<number> => {

    try {
        // await sleep(3);
        const stockProductSlug = await prisma.product.findFirst({
            where: {
                slug: slug
            },
            select: {inStock: true}
        })

        return stockProductSlug?.inStock ?? 0;
    } catch (error) {
        console.log(error);
        throw new Error('Error al obtener el stock producto por slug');
    }
}