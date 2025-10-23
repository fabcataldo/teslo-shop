'use server';

export const deleteUserAddress = async() => {
    try {
        return { ok: true };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo borrar la dirección'
        }
    }
}