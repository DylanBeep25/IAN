import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react'; // Íconos para adornar
import { Input } from '../components/ui/Input.jsx'; // Ajusta esta ruta si es necesario
import { useAuth } from '../context/AuthContext.jsx';
import { useForm } from '../shared/hooks/useForm.js'; 

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Usamos tu nuevo super hook
  const { formData, handleValueChange, handleValidationOnBlur, isFormValid } = useForm({
    userLoggin: { value: '', isValid: false, showError: false },
    password: { value: '', isValid: false, showError: false }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const loginData = {
      userLoggin: formData.userLoggin.value,
      password: formData.password.value
    };

    const result = await login(loginData);
    setIsLoading(false);

    if (result.success) {
      navigate('/home'); 
    }
  };

  return (
    <div className="min-h-screen bg-admosa-gray flex items-center justify-center p-4 font-sans">
      
      {/* Tarjeta del Formulario */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-admosa-dark/5 p-8 sm:p-10">
        
        {/* Cabecera del Login */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-admosa-dark rounded-xl flex items-center justify-center shadow-lg shadow-admosa-dark/20 mb-4">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black text-admosa-dark tracking-tight">
            Acceso Administrativo
          </h2>
          <p className="text-sm font-medium text-admosa-dark/50 mt-2">
            División de Inteligencia de Mercados
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            field='userLoggin'
            label='Usuario o Correo'
            value={formData.userLoggin.value}
            onChangeHandler={handleValueChange}
            placeholder='admin@empresa.com'
            type='text'
            onBlurHandler={handleValidationOnBlur}
            showErrorMessage={formData.userLoggin.showError}
            validationMessage='Por favor ingresa tu usuario'
          />
          
          <Input
            field='password'
            label='Contraseña'
            value={formData.password.value}
            onChangeHandler={handleValueChange}
            placeholder='••••••••'
            type='password'
            onBlurHandler={handleValidationOnBlur}
            showErrorMessage={formData.password.showError}
            validationMessage='La contraseña es requerida'
          />
          
          {/* Botón de Enviar */}
          <div className="pt-4">
            <button 
              disabled={!isFormValid() || isLoading} 
              type='submit'
              className={`w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 
                ${(!isFormValid() || isLoading) 
                  ? 'bg-admosa-gray text-admosa-dark/40 cursor-not-allowed' 
                  : 'bg-admosa-dark text-white hover:bg-black shadow-lg shadow-admosa-dark/20 hover:shadow-xl hover:-translate-y-0.5'
                }`}
            >
              <span>{isLoading ? 'Verificando credenciales...' : 'Iniciar Sesión'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>

        {/* Separador y Enlace para visitantes */}
        <div className="mt-8 pt-6 border-t border-admosa-dark/10">
          <p className="text-center text-sm font-medium text-admosa-dark/60">
            ¿No eres administrador?{' '}
            <Link 
              to="/home" 
              className="text-admosa-blue font-bold hover:underline underline-offset-2 transition-all"
            >
              Ir al inicio
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};