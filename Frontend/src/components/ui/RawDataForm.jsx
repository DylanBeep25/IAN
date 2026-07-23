import React, { useState } from 'react';
import { Input } from './Input.jsx'; 
import { useForm } from '../../shared/hooks/useForm.js'; 
import { addRawData, updateRawData } from '../../services/api.js'; 
import toast from 'react-hot-toast';
import { Save, Plus, Trash2, Folder, FileText, ChevronDown, ChevronRight, Link2 } from 'lucide-react';

// ==========================================
// 1. SUB-COMPONENTE RECURSIVO (El constructor visual)
// ==========================================
const TreeNode = ({ node, onChange, onDelete, level = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const handleChange = (field, value) => {
        onChange({ ...node, [field]: value });
    };

    const handleAddChild = (type) => {
        const newChild = type === 'folder' 
            ? { name: '', type: 'folder', children: [], url: '', tablero: '' }
            : { name: '', type: 'file', extension: 'xlsx', url: '', tablero: '' };
        
        onChange({ 
            ...node, 
            children: [...(node.children || []), newChild] 
        });
        setIsExpanded(true); // Expande la carpeta automáticamente al agregar
    };

    const handleChildChange = (index, newChildNode) => {
        const newChildren = [...node.children];
        newChildren[index] = newChildNode;
        onChange({ ...node, children: newChildren });
    };

    const handleChildDelete = (index) => {
        const newChildren = node.children.filter((_, i) => i !== index);
        onChange({ ...node, children: newChildren });
    };

    return (
        <div className={`relative ${level > 0 ? 'ml-6 mt-3 border-l-2 border-admosa-dark/10 pl-4' : 'mt-2'}`}>
            {/* LÍNEA CONECTORA HORIZONTAL */}
            {level > 0 && <div className="absolute -left-0.5 top-6 w-4 border-t-2 border-admosa-dark/10"></div>}

            <div className="bg-white p-3 rounded-xl border border-admosa-dark/10 shadow-sm flex flex-col gap-3 hover:border-admosa-dark/30 transition-colors">
                
                {/* FILA PRINCIPAL: Nombre y Controles */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    
                    {/* Botón de expandir (Solo si es carpeta) */}
                    {node.type === 'folder' && (
                        <button 
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1.5 hover:bg-admosa-gray rounded-lg text-admosa-dark/60 shrink-0"
                        >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    )}

                    {/* Icono del tipo */}
                    <div className="shrink-0 p-2 bg-admosa-gray rounded-lg">
                        {node.type === 'folder' 
                            ? <Folder className="w-5 h-5 text-yellow-500 fill-yellow-500/20" /> 
                            : <FileText className="w-5 h-5 text-blue-500" />}
                    </div>

                    {/* Input del Nombre */}
                    <input 
                        type="text" 
                        value={node.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder={node.type === 'folder' ? 'Nombre de Carpeta...' : 'Nombre del Archivo...'}
                        className="flex-1 min-w-[200px] px-3 py-1.5 text-sm font-bold text-admosa-dark bg-gray-50 border border-admosa-dark/10 rounded-lg focus:outline-none focus:border-admosa-dark focus:bg-white"
                    />

                    {/* Eliminar Nodo */}
                    <button 
                        type="button"
                        onClick={onDelete}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                        title="Eliminar elemento"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* FILA SECUNDARIA: Detalles extra (URL, Extensión, Tablero) */}
                <div className="flex flex-wrap items-center gap-3 pl-1 sm:pl-[4.5rem]">
                    
                    {/* Extensión (Solo archivos) */}
                    {node.type === 'file' && (
                        <select 
                            value={node.extension || 'xlsx'} 
                            onChange={(e) => handleChange('extension', e.target.value)}
                            className="text-xs font-bold px-2 py-1.5 bg-gray-50 border border-admosa-dark/10 rounded-lg text-admosa-dark outline-none"
                        >
                            <option value="xlsx">Excel (.xlsx)</option>
                            <option value="csv">CSV (.csv)</option>
                            <option value="pptx">PowerPoint (.pptx)</option>
                            <option value="svg">Imagen Vector (.svg)</option>
                            <option value="jpg">Imagen JPG (.jpg)</option>
                            <option value="pdf">PDF (.pdf)</option>
                        </select>
                    )}

                    {/* URL (Para archivos y para carpetas con acceso directo) */}
                    <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-gray-50 border border-admosa-dark/10 rounded-lg px-2">
                        <Link2 className="w-3 h-3 text-admosa-dark/40" />
                        <input 
                            type="text"
                            value={node.url || ''}
                            onChange={(e) => handleChange('url', e.target.value)}
                            placeholder={node.type === 'folder' ? "URL opcional (Acceso directo OneDrive)" : "Enlace directo al archivo"}
                            className="w-full text-xs py-1.5 bg-transparent outline-none text-blue-600 placeholder:text-admosa-dark/30"
                        />
                    </div>

                    {/* Tablero Relacionado */}
                    <input 
                        type="text"
                        value={node.tablero || ''}
                        onChange={(e) => handleChange('tablero', e.target.value)}
                        placeholder="Tag del tablero (Ej. AUP GT)"
                        className="w-32 text-xs font-bold py-1.5 px-2 bg-gray-50 border border-admosa-dark/10 rounded-lg text-admosa-dark outline-none placeholder:text-admosa-dark/30"
                    />
                </div>

                {/* CONTROLES DE CARPETA: Botones para agregar hijos */}
                {node.type === 'folder' && (
                    <div className="flex items-center gap-2 pl-[4.5rem] mt-1">
                        <button 
                            type="button"
                            onClick={() => handleAddChild('folder')}
                            className="text-[10px] font-bold uppercase tracking-wider text-admosa-dark/60 bg-admosa-gray hover:bg-admosa-dark/10 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
                        >
                            <Plus className="w-3 h-3" /> Carpeta
                        </button>
                        <button 
                            type="button"
                            onClick={() => handleAddChild('file')}
                            className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
                        >
                            <Plus className="w-3 h-3" /> Archivo
                        </button>
                    </div>
                )}
            </div>

            {/* RENDERIZADO DE LOS HIJOS (Aquí ocurre la recursividad) */}
            {node.type === 'folder' && isExpanded && node.children && node.children.length > 0 && (
                <div className="flex flex-col gap-1 relative">
                    {node.children.map((child, index) => (
                        <TreeNode 
                            key={index} 
                            node={child} 
                            level={level + 1}
                            onChange={(newChildNode) => handleChildChange(index, newChildNode)}
                            onDelete={() => handleChildDelete(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


// ==========================================
// 2. FORMULARIO PRINCIPAL
// ==========================================
export const RawDataForm = ({ rawData, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estado principal para el árbol visual (Ya no es texto)
    const [contenidoVisual, setContenidoVisual] = useState(rawData?.contenido || []);

    const { formData, handleValueChange, handleValidationOnBlur, isFormValid } = useForm({
        nombreCarpeta: { 
            value: rawData?.nombreCarpeta || '', 
            isValid: !!rawData, 
            showError: false 
        },
        descripcion: { 
            value: rawData?.descripcion || '', 
            isValid: true, 
            showError: false 
        }
    });

    // Controladores para los Nodos Raíz
    const handleAddRootFolder = () => {
        setContenidoVisual([...contenidoVisual, { name: 'Nueva Carpeta Principal', type: 'folder', children: [], url: '', tablero: '' }]);
    };

    const handleRootNodeChange = (index, newNode) => {
        const newContenido = [...contenidoVisual];
        newContenido[index] = newNode;
        setContenidoVisual(newContenido);
    };

    const handleRootNodeDelete = (index) => {
        setContenidoVisual(contenidoVisual.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación básica visual
        if (contenidoVisual.length === 0) {
            toast.error("Debes agregar al menos una carpeta principal en la estructura.");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            nombreCarpeta: formData.nombreCarpeta.value,
            descripcion: formData.descripcion.value,
            // Enviamos el objeto JSON perfecto construido por nuestro árbol visual
            contenido: contenidoVisual 
        };

        let res;
        const rawDataId = rawData?._id || rawData?.id;

        if (rawData) {
            res = await updateRawData(rawDataId, payload);
        } else {
            res = await addRawData(payload);
        }

        setIsSubmitting(false);

        if (!res.error) {
            toast.success(rawData ? 'Carpeta actualizada correctamente' : 'Carpeta creada exitosamente');
            onSuccess(); 
        } else {
            toast.error(res.message || 'Ocurrió un error al guardar');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 gap-4 bg-admosa-gray/30 p-4 rounded-xl border border-admosa-dark/10">
                <Input
                    field="nombreCarpeta"
                    label="Nombre de la Colección (Ej. Parque Vehicular Motos GT) *"
                    value={formData.nombreCarpeta.value}
                    onChangeHandler={handleValueChange}
                    onBlurHandler={handleValidationOnBlur}
                    type="text"
                />

                <Input
                    field="descripcion"
                    label="Descripción Corta"
                    value={formData.descripcion.value}
                    onChangeHandler={handleValueChange}
                    onBlurHandler={handleValidationOnBlur}
                    type="text"
                    textarea={true}
                />
            </div>

            {/* ZONA DEL CONSTRUCTOR VISUAL */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-admosa-dark/10 pb-2">
                    <label className="text-sm font-black text-admosa-dark">
                        Estructura de Archivos
                    </label>
                    <button 
                        type="button"
                        onClick={handleAddRootFolder}
                        className="text-xs font-bold bg-admosa-dark text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-black transition-colors"
                    >
                        <Plus className="w-3 h-3" /> Añadir Carpeta Raíz
                    </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-admosa-dark/10 min-h-[200px] overflow-y-auto max-h-[500px]">
                    {contenidoVisual.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-admosa-dark/40 py-10">
                            <Folder className="w-10 h-10 mb-2 opacity-20" />
                            <p className="text-sm font-bold">Estructura vacía</p>
                            <p className="text-xs mt-1 text-center">Haz clic en el botón de arriba para comenzar a construir tu estructura de archivos.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {contenidoVisual.map((rootNode, index) => (
                                <TreeNode 
                                    key={index}
                                    node={rootNode}
                                    onChange={(newNode) => handleRootNodeChange(index, newNode)}
                                    onDelete={() => handleRootNodeDelete(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* BOTÓN DE GUARDAR */}
            <div className="pt-4 border-t border-admosa-dark/10">
                <button
                    type="submit"
                    disabled={!isFormValid() || isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                        (!isFormValid() || isSubmitting)
                            ? 'bg-admosa-gray text-admosa-dark/40 cursor-not-allowed'
                            : 'bg-admosa-dark text-white hover:bg-black shadow-lg shadow-admosa-dark/20'
                    }`}
                >
                    <Save className="w-5 h-5" />
                    <span>{isSubmitting ? 'Guardando...' : (rawData ? 'Guardar Cambios' : 'Crear Colección')}</span>
                </button>
            </div>
        </form>
    );
};