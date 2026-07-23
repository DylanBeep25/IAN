import React, { useState } from 'react';
import { Input } from './Input.jsx'; 
import { useForm } from '../../shared/hooks/useForm.js'; 
import { addSynonym, updateSynonym } from '../../services/api.js'; 
import toast from 'react-hot-toast';
import { Save, X, Plus } from 'lucide-react';

export const SynonymForm = ({ synonymData, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estado separado para manejar el arreglo de sinónimos visualmente
    const [sinonimosList, setSinonimosList] = useState(synonymData?.sinonimos || []);
    const [currentTag, setCurrentTag] = useState('');

    const { formData, handleValueChange, handleValidationOnBlur, isFormValid } = useForm({
        termino: { 
            value: synonymData?.termino || '', 
            isValid: !!synonymData, 
            showError: false 
        },
        significado: { 
            value: synonymData?.significado || '', 
            isValid: !!synonymData, 
            showError: false 
        }
    });

    // Lógica para agregar un sinónimo al presionar Enter o la coma
    const handleAddTag = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = currentTag.trim();
            if (tag && !sinonimosList.includes(tag)) {
                setSinonimosList([...sinonimosList, tag]);
            }
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (indexToRemove) => {
        setSinonimosList(sinonimosList.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            termino: formData.termino.value,
            significado: formData.significado.value,
            sinonimos: sinonimosList
        };

        let res;
        const synonymId = synonymData?._id || synonymData?.id;

        if (synonymData) {
            res = await updateSynonym(synonymId, payload);
        } else {
            res = await addSynonym(payload);
        }

        setIsSubmitting(false);

        if (!res.error) {
            toast.success(synonymData ? 'Término actualizado correctamente' : 'Término creado exitosamente');
            onSuccess(); 
        } else {
            toast.error(res.message || 'Ocurrió un error al guardar');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            
            <Input
                field="termino"
                label="Término Oficial *"
                value={formData.termino.value}
                onChangeHandler={handleValueChange}
                onBlurHandler={handleValidationOnBlur}
                placeholder="Ej. Agencia"
                type="text"
            />

            <Input
                field="significado"
                label="Significado *"
                value={formData.significado.value}
                onChangeHandler={handleValueChange}
                onBlurHandler={handleValidationOnBlur}
                placeholder="Definición corporativa..."
                type="text"
                textarea={true}
            />

            {/* SECCIÓN DE SINÓNIMOS (TAGS) */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-admosa-dark">
                    Sinónimos (Presiona Enter para agregar)
                </label>
                
                <div className="min-h-12 p-2 bg-gray-50 border border-admosa-dark/10 rounded-xl focus-within:border-admosa-dark focus-within:ring-2 focus-within:ring-admosa-dark/20 transition-all flex flex-wrap gap-2 items-center">
                    
                    {/* Lista de Etiquetas creadas */}
                    {sinonimosList.map((tag, index) => (
                        <div key={index} className="flex items-center gap-1 bg-admosa-purple/10 text-admosa-purple px-2.5 py-1 rounded-lg text-xs font-bold border border-admosa-purple/20">
                            <span>{tag}</span>
                            <button 
                                type="button" 
                                onClick={() => handleRemoveTag(index)}
                                className="hover:bg-admosa-purple/20 p-0.5 rounded-full transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}

                    {/* Input para escribir nuevas etiquetas */}
                    <input 
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder={sinonimosList.length === 0 ? "Ej. nuevo, de paquete..." : "Agregar otro..."}
                        className="flex-1 min-w-30 bg-transparent outline-none text-sm text-admosa-dark placeholder:text-admosa-dark/40"
                    />
                </div>
            </div>

            {/* BOTÓN DE GUARDAR */}
            <div className="pt-4 mt-2 border-t border-admosa-dark/10">
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
                    <span>{isSubmitting ? 'Guardando...' : (synonymData ? 'Guardar Cambios' : 'Crear Término')}</span>
                </button>
            </div>
        </form>
    );
};