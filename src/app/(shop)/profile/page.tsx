import { auth } from "@/auth.config";
import { Title } from "@/components";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/');
    }

    const { user } = session;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Title title="Perfil" />

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-8">
                    {/* Header con avatar */}
                    <div className="px-8 py-10">
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-5xl font-bold text-black-600 shadow-xl">
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name || 'Usuario'}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    user.name?.charAt(0).toUpperCase() || 'U'
                                )}
                            </div>
                            <h2 className="mt-4 text-2xl font-bold text-black">
                                {user.name || 'Usuario'}
                            </h2>
                            <p className="mt-1 text-black-100">
                                {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                            </p>
                        </div>
                    </div>

                    {/* Información del usuario */}
                    <div className="px-8 py-8 space-y-6">
                        {/* Nombre */}
                        <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 transition-colors">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-500">Nombre completo</p>
                                <p className="mt-1 text-lg font-semibold text-gray-900">
                                    {user.name}
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 transition-colors">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-500">Correo electrónico</p>
                                <p className="mt-1 text-lg font-semibold text-gray-900 break-all">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        {/* Rol */}
                        <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 transition-colors">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-500">Rol de usuario</p>
                                <p className="mt-1 text-lg font-semibold text-gray-900 capitalize">
                                    {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}