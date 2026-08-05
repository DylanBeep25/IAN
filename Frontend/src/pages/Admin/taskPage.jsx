import { getTasks, deleteTask, exportTasksToExcel } from '../../services/api.js';
import TaskModal from '../../components/ui/taskForm.jsx';
import toast from 'react-hot-toast';
import { useCRUD } from '../../shared/hooks/useCRUD.js';

// --- Helpers para el diseño visual ---
const getStatusBadge = (status) => {
    const styles = {
        'IN_PROGRESS': 'bg-blue-100 text-blue-700 border-blue-200',
        'DONE_TODAY': 'bg-teal-100 text-teal-700 border-teal-200',
        'COMPLETED': 'bg-green-100 text-green-700 border-green-200',
        'BLOCKED': 'bg-red-100 text-red-700 border-red-200'
    };
    const labels = {
        'IN_PROGRESS': 'En Proceso',
        'DONE_TODAY': 'Hecho Hoy',
        'COMPLETED': 'Completado',
        'BLOCKED': 'Bloqueado'
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
            {labels[status] || status}
        </span>
    );
};

const getTypeIcon = (type) => {
    switch (type) {
        case 'PROJECT': return <span className="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg text-lg" title="Proyecto"></span>;
        case 'DAILY_TASK': return <span className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg text-lg" title="Tarea Diaria"></span>;
        case 'MEETING': return <span className="bg-purple-100 text-purple-700 p-1.5 rounded-lg text-lg" title="Reunión"></span>;
        default: return '📌';
    }
};

export const TasksPage = () => {
    const fetchAdapter = async () => {
        const res = await getTasks();
        if (res.error) return res;
        return { error: false, data: res.tasks };
    };

    const {
        data: tasks,
        isLoading,
        isModalOpen,
        itemToEdit,
        fetchData,
        handleDelete,
        openModal,
        closeModal
    } = useCRUD(fetchAdapter, deleteTask, 'Actividad eliminada correctamente');

    const handleExport = async () => {
        const toastId = toast.loading('Generando Excel...');
        const res = await exportTasksToExcel();
        if (res.error) {
            toast.error(res.message, { id: toastId });
        } else {
            toast.success('Excel descargado', { id: toastId });
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Actividades IAN</h1>
                    <p className="text-gray-500 text-sm mt-1">Gestiona y monitorea el rendimiento de tu área.</p>
                </div>
                <div className="flex w-full md:w-auto space-x-3">
                    <button 
                        onClick={handleExport}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 transition-all font-medium text-sm"
                    >
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Exportar Excel
                    </button>
                    <button 
                        onClick={() => openModal()}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all font-medium text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Nueva Actividad
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p className="font-medium">Cargando actividades...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-2xl">Actividad</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4">Progreso</th>
                                    <th className="px-6 py-4">Tiempo</th>
                                    <th className="px-6 py-4 text-right rounded-tr-2xl">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tasks.map(task => (
                                    <tr key={task._id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {getTypeIcon(task.type)}
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm whitespace-normal max-w-xs">{task.title}</p>
                                                    {task.type === 'PROJECT' && (
                                                        <p className="text-xs font-medium text-blue-600 mt-0.5">{task.projectName}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-4">
                                            {getStatusBadge(task.status)}
                                        </td>
                                        
                                        <td className="px-6 py-4 w-48">
                                            {task.type === 'PROJECT' ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className={`h-2 rounded-full ${task.progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                                                            style={{ width: `${task.progressPercentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700 w-8">{task.progressPercentage}%</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">- - -</span>
                                            )}
                                        </td>
                                        
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                {task.timeSpentMinutes ? `${task.timeSpentMinutes} min` : '0 min'}
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openModal(task)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Editar">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                                <button onClick={() => handleDelete(task._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Eliminar">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                
                                {tasks.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="bg-gray-100 p-4 rounded-full mb-3">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                                </div>
                                                <p className="text-gray-500 font-medium">No hay actividades registradas aún.</p>
                                                <p className="text-gray-400 text-sm mt-1">Haz clic en "Nueva Actividad" para comenzar.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <TaskModal closeModal={closeModal} refreshData={fetchData} itemToEdit={itemToEdit} />
            )}
        </div>
    );
};

export default TasksPage;