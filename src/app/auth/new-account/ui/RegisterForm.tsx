"use client";

import { login, registerUser } from "@/actions";
import { CustomButton } from "@/components/ui/custom-buttton/CustomButton";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
    name: string;
    email: string;
    password: string;
}

export const RegisterForm = () => {
    const { register, handleSubmit, formState: {errors} } = useForm<FormInputs>();
    const [errorMessage, setErrorMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async(data: FormInputs) => {
        setErrorMessage('');
        setSubmitting(true);

        const { name, email, password } = data;
        const resp = await registerUser(name, email, password);

        if(!resp.ok){
            setErrorMessage(resp.message);
            return;
        }

        await login(email.toLowerCase(), password);

        setSubmitting(false);
        window.location.replace('/');
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            {
                // errors.name?.type === 'required' && (
                //     <span className="text-red-500">* El nombre es obligatorio</span>
                // )
            }

            <label htmlFor="email">Nombre completo</label>
            <input
                // className="px-5 py-2 border bg-gray-200 rounded mb-5"
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-500': !!errors.name
                        }
                    )
                }
                type="text"
                {...register('name', {required: true})}
                autoFocus
            />

            <label htmlFor="email">Correo electrónico</label>
            <input
                // className="px-5 py-2 border bg-gray-200 rounded mb-5"
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-500': !!errors.email
                        }
                    )
                }
                type="email"
                {...register('email', { required: true, pattern: /^\S+@\S+$/i })}/>


            <label htmlFor="email">Contraseña</label>
            <input
                // className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="password"
                {...register('password', {required: true, minLength: 6})}
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-500': !!errors.password
                        }
                    )
                }    
            />

            <span className="text-red-500">{errorMessage}</span>

            <CustomButton disabled={submitting} label={"Crear cuenta"}/>

            {/* divisor l ine */ }
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/login" 
                className="btn-secondary text-center">
                Ingresar
            </Link>

        </form>
    )
}
