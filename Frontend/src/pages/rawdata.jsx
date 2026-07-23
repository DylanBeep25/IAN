import React, { useState, useEffect } from 'react';
import { Folder, FileText, FileSpreadsheet, Image as ImageIcon, ChevronRight, Download, FolderArchive, Loader2, Search, ArrowLeft, FolderOpen } from 'lucide-react';
import { getRawData } from '../../src/services/api.js';
import toast from 'react-hot-toast';

// ==========================================
// 1. EL COMPONENTE EXPLORADOR DE ARCHIVOS (Unificado en una sola tarjeta)
// ==========================================
const FileExplorer = ({ rootName, content }) => {
    const [path, setPath] = useState([]);

    useEffect(() => {
        setPath([{ name: rootName, type: 'folder', children: content }]);
    }, [rootName, content]);

    if (path.length === 0) return null;

    const currentFolder = path[path.length - 1];

    const handleFolderClick = (folder) => setPath([...path, folder]);
    const handleBreadcrumbClick = (index) => setPath(path.slice(0, index + 1));

    const getFileIcon = (extension) => {
        const ext = extension?.toLowerCase();
        if (ext === 'xlsx' || ext === 'csv') return <FileSpreadsheet className="w-10 h-10 text-emerald-500" />;
        if (ext === 'pptx' || ext === 'ppt') return <FileText className="w-10 h-10 text-orange-500" />;
        if (ext === 'svg' || ext === 'png' || ext === 'jpg') return <ImageIcon className="w-10 h-10 text-blue-500" />;
        return <FileText className="w-10 h-10 text-gray-500" />;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-admosa-dark/10 p-6 space-y-6 w-full">
            
            {/* MIGAS DE PAN (Navegación interna) */}
            <div className="flex items-center gap-2 pb-4 border-b border-admosa-dark/10 overflow-x-auto">
                {path.map((folder, index) => (
                    <React.Fragment key={index}>
                        <button 
                            onClick={() => handleBreadcrumbClick(index)}
                            className={`hover:text-blue-600 transition-colors whitespace-nowrap text-sm font-semibold ${index === path.length - 1 ? 'text-admosa-dark font-bold' : 'text-admosa-dark/50'}`}
                        >
                            {folder.name}
                        </button>
                        {index < path.length - 1 && <ChevronRight className="w-4 h-4 text-admosa-dark/30 shrink-0" />}
                    </React.Fragment>
                ))}
            </div>

            {/* CONTENIDO DE LA CARPETA (Grid de archivos/carpetas dentro de la misma tarjeta) */}
            <div>
                {(!currentFolder.children || currentFolder.children.length === 0) ? (
                    <div className="flex flex-col items-center justify-center text-admosa-dark/40 py-16">
                        <FolderArchive className="w-12 h-12 mb-3 opacity-20" />
                        <span className="font-medium">Esta carpeta está vacía</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {currentFolder.children.map((item, index) => (
                            <div 
                                key={index} 
                                onClick={() => {
                                    if (item.url) {
                                        window.open(item.url, '_blank');
                                    } else if (item.type === 'folder') {
                                        handleFolderClick(item);
                                    }
                                }}
                                className="group flex flex-col items-center justify-start p-4 rounded-xl border border-admosa-dark/5 hover:border-admosa-dark/20 hover:bg-admosa-gray/20 cursor-pointer transition-all text-center h-32 relative bg-slate-50/50"
                            >
                                {/* BADGE DE TABLERO */}
                                {item.tablero && (
                                    <span className="absolute top-2 right-2 bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-blue-200">
                                        {item.tablero}
                                    </span>
                                )}

                                <div className="mb-3 transition-transform group-hover:scale-110 mt-2">
                                    {item.type === 'folder' 
                                        ? <Folder className="w-10 h-10 text-yellow-400 fill-yellow-400/20" />
                                        : getFileIcon(item.extension)
                                    }
                                </div>
                                
                                <span className="text-xs font-semibold text-admosa-dark line-clamp-2 leading-tight px-1" title={item.name}>
                                    {item.name}
                                </span>

                                {/* INDICADOR VISUAL DE DESCARGA */}
                                {(item.url || item.type === 'file') && (
                                    <div className="absolute bottom-2 opacity-0 group-hover:opacity-100 mt-2 text-[10px] bg-admosa-dark text-white px-2 py-1 rounded flex items-center gap-1 transition-opacity shadow-md">
                                        <Download className="w-3 h-3" />
                                        Abrir
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// 2. PANTALLA PRINCIPAL DE RAW DATA
// ==========================================
const RawData = () => {
    const [lotes, setLotes] = useState([]);
    const [selectedLote, setSelectedLote] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDatos = async () => {
            setIsLoading(true);
            try {
                const res = await getRawData();
                if (!res.error && res.data) {
                    setLotes(res.data);
                } else {
                    toast.error(res.message || 'Error al cargar los archivos');
                }
            } catch (error) {
                toast.error('Error de conexión');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDatos();
    }, []);

    const filteredLotes = lotes.filter(lote => 
        lote.nombreCarpeta?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lote.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto w-full space-y-6 p-4 sm:p-6 text-admosa-dark">
            
            {/* CABECERA CON DEGRADADO PROFESIONAL (Igual al de Tableros) */}
            <div className="bg-linear-to-r from-admosa-purple to-admosa-dark text-white rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl font-bold">Archivos Raw Data</h1>
                    <p className="mt-1.5 text-white/80 text-sm leading-relaxed">
                        Explora la data cruda, mapas y presentaciones corporativas de la división.
                    </p>
                </div>

                {/* BUSCADOR INTEGRADO EN EL BANNER */}
                {!selectedLote && !isLoading && (
                    <div className="relative z-10 w-full sm:w-72">
                        <Search className="absolute left-3.5 top-3 w-4 h-4 text-admosa-dark/50" />
                        <input 
                            type="text" 
                            placeholder="Buscar colección..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white text-admosa-dark rounded-xl text-sm font-medium focus:outline-none shadow-sm transition-all placeholder-admosa-dark/40"
                        />
                    </div>
                )}
            </div>

            {/* ESTADOS DE CARGA Y CONTENIDO */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-admosa-dark/10">
                    <Loader2 className="w-10 h-10 text-admosa-blue animate-spin mb-4" />
                    <span className="text-admosa-dark/50 font-bold">Cargando servidor de archivos...</span>
                </div>
            ) : lotes.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-admosa-dark/10 text-center flex flex-col items-center">
                    <FolderOpen className="w-12 h-12 text-admosa-dark/20 mb-3" />
                    <p className="text-admosa-dark/60 font-bold text-lg">No hay archivos disponibles</p>
                </div>
            ) : selectedLote ? (
                
                /* VISTA 2: EXPLORADOR DE UNA CARPETA ESPECÍFICA */
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <button 
                        onClick={() => setSelectedLote(null)}
                        className="flex items-center gap-2 text-sm font-bold text-admosa-dark/70 hover:text-admosa-dark bg-white px-4 py-2 rounded-xl border border-admosa-dark/10 hover:bg-admosa-gray/20 transition-all w-fit shadow-xs"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Volver a todas las colecciones</span>
                    </button>
                    
                    <FileExplorer 
                        rootName={selectedLote.nombreCarpeta} 
                        content={selectedLote.contenido} 
                    />
                </div>

            ) : (
                
                /* VISTA 1: GRID DE TARJETAS PRINCIPALES */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 animate-in fade-in duration-300">
                    {filteredLotes.length === 0 ? (
                        <div className="col-span-full py-10 text-center text-admosa-dark/40 font-bold bg-white rounded-2xl border border-admosa-dark/10">
                            No se encontraron resultados para "{searchTerm}"
                        </div>
                    ) : (
                        filteredLotes.map((lote) => (
                            <div 
                                key={lote._id} 
                                onClick={() => setSelectedLote(lote)}
                                className="bg-white rounded-2xl border border-admosa-dark/5 p-5 hover:shadow-xl hover:shadow-admosa-dark/5 hover:-translate-y-1 hover:border-admosa-dark/20 transition-all cursor-pointer flex flex-col group"
                            >
                                <div className="w-12 h-8 bg-admosa-gray/50 rounded-xl flex items-center justify-center mb-4 border border-admosa-dark/5 group-hover:bg-admosa-dark transition-colors">
                                    <FolderArchive className="w-6 h-6 text-admosa-dark/70 group-hover:text-white transition-colors" />
                                </div>

                                <span className="font-black text-admosa-dark leading-tight mb-2 line-clamp-2">
                                    {lote.nombreCarpeta}
                                </span>
                                <p className="text-xs text-admosa-dark/50 flex-1 line-clamp-3 leading-relaxed">
                                    {lote.descripcion || 'Haz clic para explorar los archivos de esta colección.'}
                                </p>

                                <div className="mt-5 pt-4 border-t border-admosa-dark/10 flex items-center justify-between">
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                        Explorar <ChevronRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default RawData;