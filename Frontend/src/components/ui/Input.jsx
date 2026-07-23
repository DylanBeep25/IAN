import React from 'react'
import PropTypes from 'prop-types'

export const Input = ({
    field,
    label,
    value,
    onChangeHandler,
    showErrorMessage,
    validationMessage,
    onBlurHandler,
    type,
    placeholder,
    textarea
}) => {
    
    const handleValueChange = (e) => onChangeHandler(e.target.value, field);
    const handleOnBlur = (e) => onBlurHandler(e.target.value, field);

    // Clases base de Tailwind para el input. Si hay error, el borde se pone rojo.
    const baseInputClass = `w-full px-4 py-3 bg-admosa-gray/30 border rounded-lg text-sm text-admosa-dark transition-all outline-none focus:ring-2 focus:ring-admosa-dark/10 ${
        showErrorMessage ? 'border-red-400 focus:border-red-500' : 'border-admosa-dark/10 focus:border-admosa-dark/30'
    }`;

    return (
        <div className="w-full flex flex-col">
            <label className="text-sm font-bold text-admosa-dark/80 mb-1.5 ml-1">
                {label}
            </label>
            
            {textarea ? (
                <textarea
                    type={type}
                    value={value}
                    onChange={handleValueChange}
                    onBlur={handleOnBlur}
                    rows={5}
                    className={`${baseInputClass} resize-none`}
                    placeholder={placeholder}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={handleValueChange}
                    onBlur={handleOnBlur}
                    placeholder={placeholder}
                    className={baseInputClass}
                />
            )}
            
            {/* Contenedor del mensaje de error con altura fija para que el diseño no salte */}
            <div className="min-h-[24px] mt-1 ml-1">
                {showErrorMessage && (
                    <span className="text-xs font-semibold text-red-500">
                        {validationMessage}
                    </span>
                )}
            </div>
        </div>
    )
}

Input.propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChangeHandler: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    showErrorMessage: PropTypes.bool.isRequired,
    validationMessage: PropTypes.string,
    onBlurHandler: PropTypes.func.isRequired,
    textarea: PropTypes.bool
}