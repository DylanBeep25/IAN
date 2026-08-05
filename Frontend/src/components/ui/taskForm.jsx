import { useEffect } from 'react';
import { useForm } from '../../shared/hooks/useForm';
import { createTask, updateTask } from '../../services/api';
import toast from 'react-hot-toast';

const TaskModal = ({ closeModal, refreshData, itemToEdit }) => {
    const initialState = {
        type: { value: itemToEdit?.type || 'DAILY_TASK' },
        projectName: { value: itemToEdit?.projectName || '' },
        title: { value: itemToEdit?.title || '' },
        status: { value: itemToEdit?.status || 'IN_PROGRESS' },
        progressPercentage: { value: itemToEdit?.progressPercentage || 0 },
        timeSpentMinutes: { value: itemToEdit?.timeSpentMinutes || '' },
        comments: { value: itemToEdit?.comments || '' },
        isTemplate: { value: itemToEdit?.isTemplate || false }
    };

    const { formData, handleValueChange } = useForm(initialState);
    const isProject = formData.type?.value === 'PROJECT';

    // Limpia campos irrelevantes si se cambia de proyecto a tarea
    useEffect(() => {
        if (!isProject) {
            handleValueChange('', 'projectName');
            handleValueChange(0, 'progressPercentage');
        }
    }, [formData.type?.value]); // eslint-disable-line

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validación manual, rápida y a prueba de fallos (ignora el isValid del hook)
        if (!formData.title?.value || formData.title.value.trim() === '') {
            toast.error('La Descripción / Título es obligatoria');
            return;
        }
        if (isProject && (!formData.projectName?.value || formData.projectName.value.trim() === '')) {
            toast.error('El nombre del proyecto es obligatorio');
            return;
        }

        // 2. Construcción inteligente del payload
        const payload = {
            type: formData.type?.value,
            title: formData.title?.value,
            timeSpentMinutes: Number(formData.timeSpentMinutes?.value || 0),
            comments: formData.comments?.value || '',
            isTemplate: Boolean(formData.isTemplate?.value)
        };

        // Solo enviamos métricas complejas si es un proyecto. 
        // Si es tarea diaria, el backend ya lo marca como 'DONE_TODAY' automáticamente.
        if (isProject) {
            payload.projectName = formData.projectName?.value;
            payload.status = formData.status?.value;
            payload.progressPercentage = Number(formData.progressPercentage?.value || 0);
        }

        // 3. Envío al backend
        const res = itemToEdit 
            ? await updateTask(itemToEdit._id, payload)
            : await createTask(payload);

        if (res.error) {
            toast.error(res.message);
        } else {
            toast.success(`Actividad ${itemToEdit ? 'actualizada' : 'registrada'}`);
            refreshData();
            closeModal();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">
                        {itemToEdit ? 'Editar Actividad' : 'Registro Rápido'}
                    </h2>
                    <button onClick={closeModal} className="text-gray-400 hover:text-red-500 font-bold text-xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    
                    {/* Selector visual de Tipo (Más rápido que un select) */}
                    <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                        <button 
                            type="button"
                            onClick={() => handleValueChange('DAILY_TASK', 'type')}
                            className={`flex-1 py-1 text-sm font-medium rounded-md ${!isProject && formData.type?.value !== 'MEETING' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                        >
                            Tarea Diaria
                        </button>
                        <button 
                            type="button"
                            onClick={() => handleValueChange('PROJECT', 'type')}
                            className={`flex-1 py-1 text-sm font-medium rounded-md ${isProject ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                        >
                            Proyecto
                        </button>
                        <button 
                            type="button"
                            onClick={() => handleValueChange('MEETING', 'type')}
                            className={`flex-1 py-1 text-sm font-medium rounded-md ${formData.type?.value === 'MEETING' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                        >
                            🤝 Reunión
                        </button>
                    </div>

                    {isProject && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                                <input 
                                    type="text"
                                    placeholder="Nombre del Proyecto (Ej: App Web IAN) *"
                                    value={formData.projectName?.value || ''}
                                    onChange={(e) => handleValueChange(e.target.value, 'projectName')}
                                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <select 
                                    value={formData.status?.value || 'IN_PROGRESS'} 
                                    onChange={(e) => handleValueChange(e.target.value, 'status')}
                                    className="w-full border rounded-lg p-2 text-sm bg-white"
                                >
                                    <option value="IN_PROGRESS">En Proceso</option>
                                    <option value="COMPLETED">Completado</option>
                                    <option value="BLOCKED">Bloqueado</option>
                                </select>
                            </div>
                            <div>
                                <input 
                                    type="number" min="0" max="100" placeholder="% Avance"
                                    value={formData.progressPercentage?.value || ''}
                                    onChange={(e) => handleValueChange(e.target.value, 'progressPercentage')}
                                    className="w-full border rounded-lg p-2 text-sm outline-none"
                                    title="Porcentaje de avance"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <input 
                            type="text"
                            placeholder={isProject ? "Título del avance *" : "¿Qué hiciste? (Ej: Actualización Guatecompras) *"}
                            value={formData.title?.value || ''}
                            onChange={(e) => handleValueChange(e.target.value, 'title')}
                            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                            <input 
                                type="number" min="0" placeholder="Minutos"
                                value={formData.timeSpentMinutes?.value || ''}
                                onChange={(e) => handleValueChange(e.target.value, 'timeSpentMinutes')}
                                className="w-full border rounded-lg p-2 text-sm outline-none"
                                title="Tiempo invertido en minutos"
                            />
                        </div>
                        <div className="col-span-2">
                            <input 
                                type="text" placeholder="Comentarios adicionales (Opcional)"
                                value={formData.comments?.value || ''}
                                onChange={(e) => handleValueChange(e.target.value, 'comments')}
                                className="w-full border rounded-lg p-2 text-sm outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                        <input 
                            type="checkbox"
                            id="isTemplate"
                            checked={!!formData.isTemplate?.value}
                            onChange={(e) => handleValueChange(e.target.checked, 'isTemplate')}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 cursor-pointer"
                        />
                        <label htmlFor="isTemplate" className="text-xs text-gray-600 cursor-pointer select-none">
                            Guardar como acción rápida recurrente
                        </label>
                    </div>

                    <div className="pt-2 flex justify-end space-x-2">
                        <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">
                            Cancelar
                        </button>
                        <button type="submit" className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors">
                            {itemToEdit ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;