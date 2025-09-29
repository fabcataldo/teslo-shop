"use server";

import { auth } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export const setTransactionId = async (
    id: string,
    orderId: string
) => {
    try {
        const session = await auth();
        const userId = session?.user.id;

        if(!userId) {
            return {
                ok: false,
                message: 'No hay sesión de usuario'
            }
        }

        const order = await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                transactionId: id
            }
        });

        if(!order ){
            return {
                ok: false,
                message: `No se encontró una orden con el id ${orderId}`
            }
        }

        return {
            ok: true,
            message: 'Orden actualizada'
        };

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo actualizar id de la transacción'
        }
    }


}