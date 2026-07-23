import React, { useState } from 'react';
import { useForm } from '../../shared/hooks/useForm.js';
import { createUser } from '../../services/api.js';
import toast from 'react-hot-toast';
import { UserPlus, Shield, Mail, Lock, User, AtSign } from 'lucide-react';

export const UserForm = ({ onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { formData, handleValueChange, handleValidationOnBlur, isFormValid } = useForm({
        name: { value: '', isValid: false, showError: false },
        surname: { value: '', isValid: false, showError: false },
        username: { value: '', isValid: false, showError: false },
        email: { value: '', isValid: false, showError: false },
        password: { value: '', isValid: false, showError: false },
        role: { value: 'ADMIN', isValid: true, showError: false }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            name: formData.name.value.trim(),
            surname: formData.surname.value.trim(),
            username: formData.username.value.trim().toLowerCase(),
            email: formData.email.value.trim().toLowerCase(),
            password: formData.password.value,
            role: formData.role.value
        };

        const res = await createUser(payload);
        setIsSubmitting(false);

        if (!res.error) {
            toast.success('Usuario registrado exitosamente');
            onSuccess();
        } else {
            toast.error(res.message || 'Error al crear el usuario');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre *</label>
                    <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Ej. Emanuel"
                            value={formData.name.value}
                            onChange={(e) => handleValueChange(e.target.value, 'name')}
                            onBlur={() => handleValidationOnBlur(formData.name.value, 'name')}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800 focus:bg-white"
                            required
                        />
                    </div>
                </div>

                {/* Apellido */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apellido *</label>
                    <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Ej. Mucía"
                            value={formData.surname.value}
                            onChange={(e) => handleValueChange(e.target.value, 'surname')}
                            onBlur={() => handleValidationOnBlur(formData.surname.value, 'surname')}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800 focus:bg-white"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Username *</label>
                    <div className="relative">
                        <AtSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="ej. 1emanuel"
                            value={formData.username.value}
                            onChange={(e) => handleValueChange(e.target.value, 'username')}
                            onBlur={() => handleValidationOnBlur(formData.username.value, 'username')}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800 focus:bg-white"
                            required
                        />
                    </div>
                </div>

                {/* Rol */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rol Asignado *</label>
                    <div className="relative">
                        <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={formData.role.value}
                            onChange={(e) => handleValueChange(e.target.value, 'role')}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800 focus:bg-white"
                        >
                            <option value="ADMIN">ADMIN</option>
                            <option value="FULL ADMIN">FULL ADMIN</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correo Electrónico *</label>
                <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="email"
                        placeholder="correo@empresa.com"
                        value={formData.email.value}
                        onChange={(e) => handleValueChange(e.target.value, 'email')}
                        onBlur={() => handleValidationOnBlur(formData.email.value, 'email')}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800 focus:bg-white"
                        required
                    />
                </div>
            </div>

            {/* Contraseña */}
            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contraseña Temporal *</label>
                <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        value={formData.password.value}
                        onChange={(e) => handleValueChange(e.target.value, 'password')}
                        onBlur={() => handleValidationOnBlur(formData.password.value, 'password')}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800 focus:bg-white"
                        required
                    />
                </div>
            </div>

            {/* Botón */}
            <div className="pt-3 border-t border-slate-100">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>{isSubmitting ? 'Registrando...' : 'Crear Usuario'}</span>
                </button>
            </div>
        </form>
    );
};