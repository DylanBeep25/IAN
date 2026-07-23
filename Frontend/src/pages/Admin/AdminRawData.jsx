import React from 'react';
import { Plus, Edit, Trash2, FolderArchive, X } from 'lucide-react';
import { getRawData, deleteRawData } from '../../services/api.js'; // Ajusta la ruta a tu api
import { useCRUD } from '../../shared/hooks/useCRUD.js';
import { RawDataForm } from '../../components/ui/RawDataForm.jsx';

export const AdminRawData = () => {
    const {
        data: lotes, 
        isLoading,
        isModalOpen,
        itemToEdit: loteToEdit,
        fetchData,
        handleDelete,
        openModal,
        closeModal
    } = useCRUD(getRawData, deleteRawData, 'Carpeta eliminada exitosamente');

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            
            {/* CABECERA */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-admosa-dark/10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-admosa-dark text-white rounded-xl shadow-md">
                        <FolderArchive className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-admosa-dark">Administración Raw Data</h1>
                        <p className="text-sm font-medium text-admosa-dark/60">Gestiona las carpetas raíz y su contenido en JSON.</p>
                    </div>
                </div>
                
                <button 
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-admosa-dark text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-admosa-dark/20 hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nueva Carpeta Raíz</span>
                </button>
            </div>

            {/* TABLA DE DATOS */}
            <div className="bg-white rounded-2xl shadow-sm border border-admosa-dark/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-admosa-gray/50 border-b border-admosa-dark/10 text-xs font-bold text-admosa-dark/60 uppercase tracking-wider">
                                <th className="p-4 pl-6">Carpeta Principal</th>
                                <th className="p-4 text-center">Contenido Interno</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admosa-dark/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-admosa-dark/50 font-medium">
                                        Cargando carpetas...
                                    </td>
                                </tr>
                            ) : lotes.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-admosa-dark/50 font-medium">
                                        No hay carpetas registradas.
                                    </td>
                                </tr>
                            ) : (
                                lotes.map((lote) => (
                                    <tr key={lote._id || lote.id} className="hover:bg-admosa-gray/20 transition-colors group">
                                        
                                        <td className="p-4 pl-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-admosa-dark text-sm">
                                                    {lote.nombreCarpeta || 'Sin Nombre'}
                                                </span>
                                                <span className="text-xs text-admosa-dark/50 mt-1 truncate max-w-sm">
                                                    {lote.descripcion || 'Sin descripción'}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-4 text-center">
                                            <span className="text-xs font-bold bg-admosa-gray px-3 py-1 rounded-full text-admosa-dark/70">
                                                {lote.contenido?.length || 0} Nodos Raíz
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => openModal(lote)}
                                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                    title="Editar JSON"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(lote._id || lote.id)}
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

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
                    
                    <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-admosa-dark/10">
                            <h2 className="text-xl font-bold text-admosa-dark">
                                {loteToEdit ? 'Editar Carpeta y JSON' : 'Nueva Carpeta Raíz'}
                            </h2>
                            <button onClick={closeModal} className="p-2 text-admosa-dark/50 hover:bg-admosa-gray rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <RawDataForm rawData={loteToEdit} onSuccess={() => { closeModal(); fetchData(); }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};