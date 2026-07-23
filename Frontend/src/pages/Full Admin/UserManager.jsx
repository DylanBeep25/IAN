import React, { useState, useEffect } from 'react';
import { Trash2, UserPlus, Shield, User } from 'lucide-react';
import { getAllUsers } from '../../services/api.js';
import toast from 'react-hot-toast';

export const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Función para cargar los usuarios al abrir la página
  const fetchUsers = async () => {
    setIsLoading(true);
    const response = await getAllUsers();
    
    if (response.error) {
      toast.error(response.message);
    } else {
      // Ajusta 'response.data' o 'response.users' según lo que devuelva tu backe   nd
      setUsers(response.data || response); 
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para eliminar usuario
  const handleDelete = async (id) => {
    
    /*
    // Confirmación nativa simple (puedes cambiarla por un Modal bonito después)
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.");
    
    if (!isConfirmed) return;

    const response = await deleteUser(id);

    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success("Usuario eliminado correctamente");
      // Filtramos el usuario borrado del estado para no recargar toda la página
      setUsers(users.filter(user => user._id !== id)); // Asumiendo que el ID en Mongo/BD es _id
    }
    */
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-admosa-dark/10 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-admosa-dark">Gestión de Usuarios</h1>
          <p className="text-sm text-admosa-dark/60 mt-1">Administra los accesos y roles del sistema.</p>
        </div>
        
        {/* Aquí podrías poner un <Link> a tu formulario de registro si lo tienes */}
        <button className="flex items-center gap-2 bg-admosa-dark text-white px-4 py-2 rounded-lg font-semibold hover:bg-admosa-dark/90 transition-colors">
          <UserPlus className="w-4 h-4" />
          <span>Agregar Usuario</span>
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-xl border border-admosa-dark/10 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-admosa-dark/50">Cargando usuarios...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-admosa-dark/50">No hay usuarios registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-admosa-gray/50 border-b border-admosa-dark/10 text-sm">
                  <th className="p-4 font-semibold text-admosa-dark/70">Usuario</th>
                  <th className="p-4 font-semibold text-admosa-dark/70">Correo</th>
                  <th className="p-4 font-semibold text-admosa-dark/70">Rol</th>
                  <th className="p-4 font-semibold text-admosa-dark/70 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admosa-dark/10">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-admosa-gray/20 transition-colors">
                    
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-admosa-blue/10 flex items-center justify-center text-admosa-blue">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-admosa-dark">
                          {user.username || user.name}
                        </span>
                      </div>
                    </td>
                    
                    <td className="p-4 text-admosa-dark/70">
                      {user.email || 'Sin correo'}
                    </td>
                    
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.role === 'FULL ADMIN' || user.role === 'full_admin'
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>
                    
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(user._id || user.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};