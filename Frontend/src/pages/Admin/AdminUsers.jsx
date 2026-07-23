import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Search, ShieldCheck, Mail, X } from 'lucide-react';
import { getAllUsers, deleteUser, updateUserAdmin } from '../../services/api.js';
import { useCRUD } from '../../shared/hooks/useCRUD.js';
import { UserForm } from '../../components/ui/UsersForm.jsx';
import toast from 'react-hot-toast';

export const AdminUsers = () => {
    // Reutilizamos el hook useCRUD
    const {
        data: usuarios,
        isLoading,
        isModalOpen,
        fetchData,
        handleDelete,
        openModal,
        closeModal
    } = useCRUD(getAllUsers, deleteUser, 'Usuario eliminado correctamente');

    const [searchTerm, setSearchTerm] = useState('');

    // Cambio de rol directo desde la tabla (Solo FULL ADMIN)
    const handleRoleChange = async (userId, newRole) => {
        const res = await updateUserAdmin(userId, newRole);
        if (!res.error) {
            toast.success(`Rol actualizado a ${newRole}`);
            fetchData(); // Recargamos el listado
        } else {
            toast.error(res.message || 'Error al actualizar el rol');
        }
    };

    // Filtro en tiempo real
    const filteredUsers = (usuarios || []).filter(u => {
        const text = searchTerm.toLowerCase();
        return (
            u.name?.toLowerCase().includes(text) ||
            u.surname?.toLowerCase().includes(text) ||
            u.username?.toLowerCase().includes(text) ||
            u.email?.toLowerCase().includes(text)
        );
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            
            {/* CABECERA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 text-white rounded-xl shadow-md">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Administración de Usuarios</h1>
                        <p className="text-sm font-medium text-slate-500">Gestiona los permisos y acceso del equipo IAN.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-slate-800 focus:bg-white"
                        />
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-black transition-all shadow-md shrink-0"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Nuevo Usuario</span>
                    </button>
                </div>
            </div>

            {/* TABLA DE USUARIOS */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="p-4 pl-6">Usuario</th>
                                <th className="p-4">Contacto</th>
                                <th className="p-4">Rol en Sistema</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-400 font-medium">
                                        Cargando usuarios...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-400 font-medium">
                                        No se encontraron registros.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u._id || u.id} className="hover:bg-slate-50/80 transition-colors">
                                        
                                        {/* Nombre y Username */}
                                        <td className="p-4 pl-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 text-sm">
                                                    {u.name} {u.surname}
                                                </span>
                                                <span className="text-xs text-slate-400">@{u.username}</span>
                                            </div>
                                        </td>

                                        {/* Correo */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span>{u.email}</span>
                                            </div>
                                        </td>

                                        {/* Selector de Rol */}
                                        <td className="p-4">
                                            <div className="inline-flex items-center gap-1.5">
                                                <ShieldCheck className={`w-4 h-4 ${u.role === 'FULL ADMIN' ? 'text-purple-600' : 'text-blue-600'}`} />
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleRoleChange(u._id || u.id, e.target.value)}
                                                    className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2 py-1 outline-none focus:border-slate-800 cursor-pointer"
                                                >
                                                    <option value="ADMIN">ADMIN</option>
                                                    <option value="FULL ADMIN">FULL ADMIN</option>
                                                </select>
                                            </div>
                                        </td>

                                        {/* Acciones */}
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleDelete(u._id || u.id)}
                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                title="Eliminar Usuario"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL PARA CREAR USUARIO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800">Registrar Nuevo Usuario</h2>
                            <button onClick={closeModal} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5">
                            <UserForm onSuccess={() => { closeModal(); fetchData(); }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};