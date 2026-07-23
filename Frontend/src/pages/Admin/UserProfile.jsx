import React, { useState, useEffect } from 'react';
import { UserCog, Save, Lock, Mail, User, AtSign, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getUserProfile, updateProfile } from '../../services/api.js'; 
import toast from 'react-hot-toast';

export default function UserProfile() {
    const { user, setUser } = useAuth(); 
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        username: '',
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // 1. CARGAMOS LA DATA FRESCA DESDE MONGODB AL MONTAR LA VISTA
// 1. CARGAMOS LA DATA FRESCA DESDE MONGODB AL MONTAR LA VISTA
    useEffect(() => {
        if (!user) return;

        const fetchUserData = async () => {
            setIsLoadingData(true);
            try {
                const res = await getUserProfile();
                const userData = res?.user || res?.data;

                if (res?.success && userData) {
                    setFormData({
                        name: userData.name || '',
                        surname: userData.surname || '',
                        username: userData.username || '',
                        email: userData.email || '',
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    });
                } else {
                    // Fallback por si la respuesta no trae success
                    setFormData({
                        name: user.name || '',
                        surname: user.surname || '',
                        username: user.username || '',
                        email: user.email || '',
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    });
                }
            } catch (error) {
                console.error("Error al cargar perfil:", error);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchUserData();
    }, [user]);

    const userInitial = (formData.name || formData.username || 'D').charAt(0).toUpperCase();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (showSuccess) setShowSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowSuccess(false);
        
        if (formData.newPassword || formData.oldPassword) {
            if (!formData.oldPassword) {
                return toast.error('Debes ingresar tu contraseña actual');
            }
            if (formData.newPassword !== formData.confirmPassword) {
                return toast.error('Las contraseñas nuevas no coinciden');
            }
        }

        setIsSubmitting(true);

        const payload = {
            name: formData.name,
            surname: formData.surname,
            username: formData.username,
            email: formData.email
        };

        if (formData.newPassword) {
            payload.oldPassword = formData.oldPassword;
            payload.newPassword = formData.newPassword;
        }

        const res = await updateProfile(payload);
        
        if (!res.error) {
            toast.success('Perfil actualizado correctamente');
            setShowSuccess(true);
            
            // ACTUALIZAMOS EL LOCALSTORAGE Y EL CONTEXTO CON LA NUEVA DATA
            const updatedUserData = res.user || res.data || res;
            if (updatedUserData && updatedUserData.name) {
                const updatedUser = { ...user, ...updatedUserData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                if (setUser) setUser(updatedUser); 
            }

            setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
        } else {
            toast.error(res.message || 'Error al actualizar el perfil');
        }
        
        setIsSubmitting(false);
    };

    if (isLoadingData) {
        return (
            <div className="max-w-7xl mx-auto w-full p-12 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-admosa-blue animate-spin" />
                <p className="text-sm font-medium text-slate-500">Obteniendo información de perfil desde MongoDB...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto w-full space-y-6 p-4 sm:p-6 text-admosa-dark">
            
            {/* CABECERA VISUAL DEL PERFIL */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-admosa-dark/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-admosa-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                    <div className="w-24 h-24 rounded-2xl bg-slate-900 text-white font-black flex items-center justify-center text-4xl shadow-lg shrink-0 border-4 border-white outline outline-1 outline-slate-100">
                        {userInitial}
                    </div>
                    
                    <div className="text-center sm:text-left flex-1 mt-2">
                        <h1 className="text-3xl font-black text-admosa-dark">
                            {formData.name ? `${formData.name} ${formData.surname}` : formData.username}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                            <span className="flex items-center gap-1.5 text-xs font-bold bg-admosa-blue/10 text-admosa-blue px-3 py-1.5 rounded-lg border border-admosa-blue/20">
                                <ShieldCheck className="w-4 h-4" />
                                {user?.role || 'Administrador'}
                            </span>
                            <span className="text-sm font-medium text-admosa-dark/50">
                                Gestiona tu identidad y credenciales
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* BANNER DE ÉXITO VISUAL */}
            {showSuccess && (
                <div className="bg-[#00C988]/10 border border-[#00C988]/30 p-4 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm">
                    <div className="bg-[#00C988] rounded-full p-1 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(0,201,136,0.3)]">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#00C988] text-sm">¡Cambios guardados exitosamente!</h3>
                        <p className="text-xs text-admosa-dark/60 mt-1 font-medium">
                            Tus datos se han actualizado de forma segura en la base de datos. Los cambios visuales en el menú se reflejarán completamente en tu próximo inicio de sesión.
                        </p>
                    </div>
                </div>
            )}

            {/* FORMULARIO */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* COLUMNA 1: Datos Personales */}
                <div className="bg-white rounded-2xl shadow-sm border border-admosa-dark/10 p-6 sm:p-8 space-y-6">
                    <div>
                        <h3 className="font-bold text-lg text-admosa-dark flex items-center gap-2">
                            <UserCog className="w-5 h-5 text-admosa-blue" />
                            Información Personal
                        </h3>
                        <p className="text-xs text-admosa-dark/50 mt-1">Cómo te verán otros usuarios en el sistema.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                        <div>
                            <label className="block text-xs font-bold text-admosa-dark/70 uppercase mb-1.5">Nombre</label>
                            <div className="relative group">
                                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-admosa-dark/40 group-focus-within:text-admosa-blue transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-admosa-gray/30 border border-admosa-dark/10 rounded-xl text-sm font-medium focus:outline-none focus:border-admosa-blue focus:ring-1 focus:ring-admosa-blue focus:bg-white transition-all text-admosa-dark"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-admosa-dark/70 uppercase mb-1.5">Apellido</label>
                            <div className="relative group">
                                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-admosa-dark/40 group-focus-within:text-admosa-blue transition-colors" />
                                <input
                                    type="text"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-admosa-gray/30 border border-admosa-dark/10 rounded-xl text-sm font-medium focus:outline-none focus:border-admosa-blue focus:ring-1 focus:ring-admosa-blue focus:bg-white transition-all text-admosa-dark"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-admosa-dark/70 uppercase mb-1.5">Username de acceso</label>
                        <div className="relative group">
                            <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-admosa-dark/40 group-focus-within:text-admosa-blue transition-colors" />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-admosa-gray/30 border border-admosa-dark/10 rounded-xl text-sm font-medium focus:outline-none focus:border-admosa-blue focus:ring-1 focus:ring-admosa-blue focus:bg-white transition-all text-admosa-dark"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-admosa-dark/70 uppercase mb-1.5">Correo Electrónico Corporativo</label>
                        <div className="relative group">
                            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-admosa-dark/40 group-focus-within:text-admosa-blue transition-colors" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-admosa-gray/30 border border-admosa-dark/10 rounded-xl text-sm font-medium focus:outline-none focus:border-admosa-blue focus:ring-1 focus:ring-admosa-blue focus:bg-white transition-all text-admosa-dark"
                            />
                        </div>
                    </div>
                </div>

                {/* COLUMNA 2: Seguridad y Contraseña */}
                <div className="bg-white rounded-2xl shadow-sm border border-admosa-dark/10 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-lg text-admosa-dark flex items-center gap-2">
                                <Lock className="w-5 h-5 text-admosa-purple" />
                                Seguridad de la Cuenta
                            </h3>
                            <p className="text-xs text-admosa-dark/50 mt-1">
                                Deja estos campos en blanco si no deseas modificar tu contraseña.
                            </p>
                        </div>

                        <div className="pt-2">
                            <label className="block text-xs font-bold text-admosa-dark/70 uppercase mb-1.5">Contraseña Actual</label>
                            <div className="relative group">
                                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-admosa-dark/40 group-focus-within:text-admosa-purple transition-colors" />
                                <input
                                    type="password"
                                    name="oldPassword"
                                    placeholder="Requerida para autorizar cambios"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-admosa-gray/30 border border-admosa-dark/10 rounded-xl text-sm font-medium focus:outline-none focus:border-admosa-purple focus:ring-1 focus:ring-admosa-purple focus:bg-white transition-all text-admosa-dark placeholder-admosa-dark/30"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 bg-admosa-purple/5 rounded-xl border border-admosa-purple/10">
                            <div>
                                <label className="block text-xs font-bold text-admosa-purple uppercase mb-1.5">Nueva Contraseña</label>
                                <div className="relative group">
                                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-admosa-purple/50 group-focus-within:text-admosa-purple transition-colors" />
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-admosa-purple/20 rounded-xl text-sm font-medium focus:outline-none focus:border-admosa-purple focus:ring-1 focus:ring-admosa-purple transition-all text-admosa-dark"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-admosa-purple uppercase mb-1.5">Confirmar Nueva</label>
                                <div className="relative group">
                                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-admosa-purple/50 group-focus-within:text-admosa-purple transition-colors" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-admosa-purple/20 rounded-xl text-sm font-medium focus:outline-none focus:border-admosa-purple focus:ring-1 focus:ring-admosa-purple transition-all text-admosa-dark"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-admosa-dark/10">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
                        >
                            <Save className={`w-5 h-5 ${isSubmitting ? 'animate-bounce' : ''}`} />
                            <span>{isSubmitting ? 'Cifrando y Guardando...' : 'Guardar Todos los Cambios'}</span>
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
}