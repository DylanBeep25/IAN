import { useState } from "react";

export const useForm = (initialState) =>{

    //Guardamos el estado del formulario
    const [formData, setFormData] = useState(initialState)


    //Función para actualizar el valor mientras el usuario escribe
    const handleValueChange = (value, field)=>{
        setFormData((prevData)=> ({
            ...prevData,
            [field]: { ...prevData[field], value}
        }))
    }

    //Función para validar cuando el usuario sale del input (onBlur)
    const handleValidationOnBlur = (value, field) =>{
        const isValid = value.trim() !== ''
        setFormData((prevData) => ({
            ...prevData,
            [field]: { ...prevData[field], isValid, showError: !isValid}
        }))
    }

    //Función para verificar si todo el formulario es válido
    const isFormValid = () =>{
        return Object.values(formData).every((field) => field.isValid)
    }

    // Función para limpiar el formulario después de guardar
    const resetForm = () => {
        setFormData(initialState)
    }

    return {
        formData,
        handleValueChange,
        handleValidationOnBlur,
        isFormValid,
        resetForm
    }
}