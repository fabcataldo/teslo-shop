'use server';

import { signOut } from "@/auth.config";

export const logout = async () => {
    console.log('se llamo al loguut')
    await signOut();
}