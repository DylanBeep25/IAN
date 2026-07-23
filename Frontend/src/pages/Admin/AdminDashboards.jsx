import React from 'react';
import { Plus, Edit, Trash2, LayoutDashboard, X, Eye } from 'lucide-react'; // Agregamos Eye
import { getAllDashboards, deleteDashboard } from '../../services/api.js';
import { useCRUD } from '../../shared/hooks/useCRUD.js';
import { DashboardForm } from '../../components/ui/DashboardForm.jsx';

export const AdminDashboards = () => {
    
    const {
        data: dashboards, 
        isLoading,
        isModalOpen,
        itemToEdit: dashboardToEdit,
        fetchData,
        handleDelete,
        openModal,
        closeModal
    } = useCRUD(getAllDashboards, deleteDashboard, 'Tablero eliminado exitosamente');

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            
            {/* CABECERA */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-admosa-dark/10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-admosa-dark text-white rounded-xl shadow-md">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-admosa-dark">Administración de Tableros</h1>
                        <p className="text-sm font-medium text-admosa-dark/60">Gestiona los dashboards operativos que verán los usuarios.</p>
                    </div>
                </div>
                
                <button 
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-admosa-dark text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-admosa-dark/20 hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    <span>Agregar Tablero</span>
                </button>
            </div>

            {/* TABLA DE DATOS (EVOLUCIONADA) */}
            <div className="bg-white rounded-2xl shadow-sm border border-admosa-dark/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-admosa-gray/50 border-b border-admosa-dark/10 text-xs font-bold text-admosa-dark/60 uppercase tracking-wider">
                                <th className="p-4 pl-6">Tablero</th>
                                <th className="p-4">Área / Sector</th>
                                <th className="p-4">Actualización</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admosa-dark/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-admosa-dark/50 font-medium">
                                        Cargando tableros...
                                    </td>
                                </tr>
                            ) : dashboards.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-admosa-dark/50 font-medium">
                                        No hay tableros registrados.
                                    </td>
                                </tr>
                            ) : (
                                dashboards.map((dash) => (
                                    <tr key={dash._id || dash.id} className="hover:bg-admosa-gray/20 transition-colors group">
                                        
                                        {/* COLUMNA 1: Código y Nombre */}
                                        <td className="p-4 pl-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold font-mono bg-admosa-dark/5 text-admosa-dark/60 px-2 py-0.5 rounded">
                                                        {dash.codigo || 'S/C'}
                                                    </span>
                                                    <span className="font-bold text-admosa-dark text-sm">
                                                        {dash.nombre || 'Sin Título'}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-admosa-dark/50 mt-1 truncate max-w-xs" title={dash.descripcion}>
                                                    {dash.descripcion || 'Sin descripción'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* COLUMNA 2: Área y Destino */}
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-admosa-dark/80">
                                                    {dash.area || '-'}
                                                </span>
                                                <span className="text-xs text-admosa-dark/50 capitalize">
                                                    {dash.destino || '-'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* COLUMNA 3: Fechas/Frecuencia */}
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-admosa-dark/80">
                                                    {dash.frecuencia || 'No definida'}
                                                </span>
                                                {dash.actualizacion && (
                                                    <span className="text-xs text-admosa-dark/50">
                                                        Últ: {dash.actualizacion}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* COLUMNA 4: Acciones Completas */}
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => console.log('Abrir detalles', dash)} // Aquí abriremos el Modal de Detalles después
                                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 tooltip transition-colors"
                                                    title="Ver Detalles Completos"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => openModal(dash)}
                                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(dash._id || dash.id)}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DEL FORMULARIO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
                    
                    <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"> {/* max-w-2xl para darle más ancho al formulario de pestañas */}
                        <div className="flex items-center justify-between p-6 border-b border-admosa-dark/10">
                            <h2 className="text-xl font-bold text-admosa-dark">
                                {dashboardToEdit ? 'Editar Tablero' : 'Nuevo Tablero'}
                            </h2>
                            <button onClick={closeModal} className="p-2 text-admosa-dark/50 hover:bg-admosa-gray rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <DashboardForm dashboard={dashboardToEdit} onSuccess={() => { closeModal(); fetchData(); }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};