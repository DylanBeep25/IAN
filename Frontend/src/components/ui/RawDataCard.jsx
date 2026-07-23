import React from 'react';
import { Edit, Trash2, FolderArchive } from 'lucide-react';

export const RawDataCard = ({ lote, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-2xl border border-admosa-dark/10 p-5 hover:shadow-xl hover:shadow-admosa-dark/5 hover:border-admosa-dark/20 transition-all flex flex-col group relative">
            
            {/* BOTONES FLOTANTES (Solo aparecen en hover/pc) */}
            <div className="absolute top-4 right-4 flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-lg p-1 z-10">
                <button 
                    onClick={onEdit}
                    className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                    title="Editar Estructura"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button 
                    onClick={onDelete}
                    className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                    title="Eliminar Carpeta"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* ICONO GRANDE */}
            <div className="w-12 h-12 bg-admosa-gray/50 rounded-xl flex items-center justify-center mb-4 border border-admosa-dark/5 group-hover:scale-105 transition-transform">
                <FolderArchive className="w-6 h-6 text-admosa-dark/70" />
            </div>

            {/* INFORMACIÓN TEXTUAL */}
            <h3 className="font-black text-admosa-dark text-lg leading-tight pr-14 mb-1 line-clamp-2">
                {lote.nombreCarpeta || 'Sin Nombre'}
            </h3>
            <p className="text-sm font-medium text-admosa-dark/50 flex-1 line-clamp-3">
                {lote.descripcion || 'Sin descripción agregada.'}
            </p>

            {/* FOOTER DE LA TARJETA */}
            <div className="mt-5 pt-4 border-t border-admosa-dark/10 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-admosa-gray px-2.5 py-1 rounded-md text-admosa-dark/60 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    {lote.contenido?.length || 0} Rutas Raíz
                </span>
            </div>
        </div>
    );
};