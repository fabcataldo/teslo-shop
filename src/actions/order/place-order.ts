'use server';

import { auth } from "@/auth.config";
import { Address, Size } from "@/interfaces";
import { prisma } from "@/lib/prisma";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}


export const placeOrder = async(
    productIds: ProductToOrder[],
    address: Address
) => {
    const session = await auth();
    const userId = session?.user.id;

    if(!userId) {
        return {
            ok: false,
            message: 'No hay sesión de usuario'
        }
    }


    //obtener lai nformación de los productos
    //recordar que puedo llevar 2 (o más) productos con el mismo ID
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(p => p.productId)
            }
        }
    });

    //calcular los montos // encabezado de mi maestro/detalle
    const itemsInOrder = productIds.reduce( (count, p) => count + p.quantity, 0);

    //totales de tax, subtotal y total en si (tax + subtotal)
    const {subTotal, tax, total} = productIds.reduce( (totals, item) => {
        const productQuantity = item.quantity;
        const product = products.find(product => product.id === item.productId);

        if(!product) throw new Error(`${item.productId} no existe - 500`);

        const subTotal = product.price * productQuantity;

        totals.subTotal += subTotal;

        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals;
    }, {subTotal: 0, tax: 0, total: 0} );

    //crear la transacción de bd
    try {
        const prismaTx = await prisma.$transaction( async(tx) => {
            //1. actualizar el stock de los productos
            const updatedProductsPromises = products.map((product) => {
                //acumular valores
                const productQuantity = productIds.filter(
                    p => p.productId === product.id
                ).reduce((acc, item) => item.quantity + acc, 0);

                if(productQuantity === 0) {
                    throw new Error(`${product.id} no tiene cantidad definida`);
                }

                return tx.product.update({
                    where: {id: product.id},
                    data: {
                        // inStock: product.inStock - productQuantity // no hacer
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })
            });

            const updatedProducts = await Promise.all(updatedProductsPromises);

            //verificar valores negativos en la existencia = no hay stock
            updatedProducts.forEach(product => {
                if(product.inStock < 0) {
                    throw new Error(`${product.title} no tiene inventario suficiente`);
                }
            });
            
            //2.Crear la orden - Encabezado - Detalles
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,

                    OrderItem: {
                        createMany: {
                            data: productIds.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            })

            //3.crear la dirección de la orden
            const { country, ...restAddress } = address;

            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id
                }
            });

            return {
                order: order,
                updatedProducts: updatedProducts,
                orderAddress: orderAddress
            }
        });
        
        
        return {
            ok: true,
            order: prismaTx.order,
            prismaTx
        }

    } catch (error: any) {
        return {
            ok: false,
            message: error?.message
        }
    }

}