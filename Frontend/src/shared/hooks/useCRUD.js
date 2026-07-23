import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const useCRUD = (getAllFn, deleteFn, deleteSuccessMsg = 'Elemento eliminado correctamente') => {
    // 1. Estados compartidos
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);

    // 2. Función para cargar datos (READ)
    const fetchData = async () => {
        setIsLoading(true);
        const res = await getAllFn();

        //console.log("Respuesta", res)
        
        if (!res.error) {
            setData(res.data || []);
        } else {
            toast.error(res.message || 'Error al cargar la información');
        }
        setIsLoading(false);
    };

    // Cargar al montar el componente
    useEffect(() => {
        fetchData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 3. Función para borrar (DELETE)
    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás completamente seguro de eliminar este elemento? Esta acción no se puede deshacer.')) return;
        
        const res = await deleteFn(id);
        if (res.error) {
            toast.error(res.message);
        } else {
            toast.success(deleteSuccessMsg);
            fetchData(); // Recarga la lista automáticamente
        }
    };

    // 4. Controladores del Modal
    const openModal = (item = null) => {
        setItemToEdit(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setItemToEdit(null);
    };

    return {
        data,
        isLoading,
        isModalOpen,
        itemToEdit,
        fetchData,
        handleDelete,
        openModal,
        closeModal
    };
};