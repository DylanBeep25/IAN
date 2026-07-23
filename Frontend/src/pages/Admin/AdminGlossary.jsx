import React, { useState } from 'react';
import { Plus, Edit, Trash2, BookOpen, X, Search } from 'lucide-react';
import { getAllSynonyms, deleteSynonym } from '../../services/api.js'; 
import { useCRUD } from '../../shared/hooks/useCRUD.js';
import { SynonymForm } from '../../components/ui/SynonymsForms.jsx';

export const AdminSynonyms = () => {
    const {
        data: terminos, 
        isLoading,
        isModalOpen,
        itemToEdit: terminoToEdit,
        fetchData,
        handleDelete,
        openModal,
        closeModal
    } = useCRUD(getAllSynonyms, deleteSynonym, 'Término eliminado exitosamente');

    const [searchTerm, setSearchTerm] = useState('');

    // Filtro en tiempo real: busca en el término, el significado o dentro del arreglo de sinónimos
    const filteredTerminos = terminos.filter(t => {
        const textToSearch = searchTerm.toLowerCase();
        const inTerm = t.termino?.toLowerCase().includes(textToSearch);
        const inDef = t.significado?.toLowerCase().includes(textToSearch);
        const inSyn = t.sinonimos?.some(s => s.toLowerCase().includes(textToSearch));
        return inTerm || inDef || inSyn;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            
            {/* CABECERA Y BUSCADOR */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-admosa-dark/10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-admosa-dark text-white rounded-xl shadow-md">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-admosa-dark">Glosario Corporativo</h1>
                        <p className="text-sm font-medium text-admosa-dark/60">Gestiona términos oficiales y sus sinónimos.</p>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admosa-dark/40" />
                        <input 
                            type="text" 
                            placeholder="Buscar palabra..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-admosa-gray/30 border border-admosa-dark/10 rounded-xl text-sm font-medium text-admosa-dark focus:outline-none focus:border-admosa-dark focus:bg-white transition-colors"
                        />
                    </div>
                    <button 
                        onClick={() => openModal()}
                        className="flex items-center justify-center gap-2 bg-admosa-dark text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-admosa-dark/20 hover:-translate-y-0.5 shrink-0"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Término</span>
                    </button>
                </div>
            </div>

            {/* TABLA DE DATOS */}
            <div className="bg-white rounded-2xl shadow-sm border border-admosa-dark/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-admosa-gray/50 border-b border-admosa-dark/10 text-xs font-bold text-admosa-dark/60 uppercase tracking-wider">
                                <th className="p-4 pl-6 w-1/4">Término Oficial</th>
                                <th className="p-4 w-2/5">Significado</th>
                                <th className="p-4 w-1/4">Sinónimos Mapeados</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admosa-dark/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-admosa-dark/50 font-medium">
                                        Cargando glosario...
                                    </td>
                                </tr>
                            ) : filteredTerminos.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-admosa-dark/50 font-medium">
                                        No se encontraron términos en el diccionario.
                                    </td>
                                </tr>
                            ) : (
                                filteredTerminos.map((item) => (
                                    <tr key={item._id || item.id} className="hover:bg-admosa-gray/20 transition-colors group">
                                        
                                        <td className="p-4 pl-6">
                                            <span className="font-bold text-admosa-dark text-sm">
                                                {item.termino}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <span className="text-sm text-admosa-dark/70 line-clamp-2" title={item.significado}>
                                                {item.significado}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {item.sinonimos && item.sinonimos.length > 0 ? (
                                                    item.sinonimos.map((syn, idx) => (
                                                        <span key={idx} className="bg-admosa-gray border border-admosa-dark/10 text-admosa-dark/70 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                                            {syn}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-admosa-dark/30 italic">Sin sinónimos</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => openModal(item)}
                                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                    title="Editar Término"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item._id || item.id)}
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
                    
                    <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-admosa-dark/10">
                            <h2 className="text-xl font-bold text-admosa-dark">
                                {terminoToEdit ? 'Editar Término' : 'Nuevo Término'}
                            </h2>
                            <button onClick={closeModal} className="p-2 text-admosa-dark/50 hover:bg-admosa-gray rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <SynonymForm synonymData={terminoToEdit} onSuccess={() => { closeModal(); fetchData(); }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};