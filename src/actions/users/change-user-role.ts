"use server";

import { auth } from "@/auth.config";
import { revalidatePath } from "next/cache";

export const changeUserRole = async() => {
    const session = await auth();

    if(session?.user.role !== 'admin') {
        return {
            ok: false,
            message: 'Debe de estar autenticado como admin'
        }
    }

    try {
        revalidatePath('/admin/users');

        return {
            ok: true
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo actualizar el rol'
        }
    }
}