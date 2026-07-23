import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi } from '../../src/services/api.js';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario desde localStorage al iniciar la app
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (loginData) => {
    // Usamos el endpoint que configuraste en api.js
    const response = await loginApi(loginData);

    // Si tu api.js devuelve un error
    if (response.error) {
      toast.error(response.message || 'Error al iniciar sesión');
      return { success: false }; 
    }

    // Si todo salió bien, extraemos datos (Ajusta los nombres según lo que devuelva tu backend)
    const token = response.token; 
    const loggedUser = response.loggedUser;

    if (!token || !loggedUser) {
      toast.error('Faltan datos en la respuesta del servidor');
      return { success: false };
    }

    // Guardar en almacenamiento local
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    
    // Actualizar estado global
    setUser(loggedUser);
    toast.success(response.message || 'Inicio de sesión exitoso');
    
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Sesión cerrada');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder fácilmente al contexto en cualquier parte de tu app
export const useAuth = () => useContext(AuthContext);