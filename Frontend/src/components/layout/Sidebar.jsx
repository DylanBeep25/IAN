import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, BotMessageSquare, BookOpen, Users, LogOut, LogIn, Database, Settings, BarChart2, FolderBookmark, ShieldAlert, ShieldCheck, UserCog } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Sidebar({ alNavegar }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Mantenemos activo el panel de administración si estamos en cualquier ruta que empiece con /admin
  const isEditingAdmin = location.pathname.startsWith('/admin');
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'FULL ADMIN' || user?.role === 'FULL_ADMIN';
  const isFullAdmin = user?.role === 'FULL ADMIN' || user?.role === 'FULL_ADMIN';

  const navLinkClass = ({ isActive }) =>
    `w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-admosa-blue/10 text-admosa-blue shadow-sm' 
        : 'text-admosa-dark/70 hover:bg-admosa-gray hover:text-admosa-dark' 
    }`;

  // Obtener inicial para el avatar
  const userInitial = (user?.name || user?.username || 'A').charAt(0).toUpperCase();

  return (
    <aside className="h-full flex flex-col justify-between min-h-0 bg-white border-r border-admosa-dark/5">
      
      {/* SECCIÓN DE NAVEGACIÓN */}
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        <div>
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-admosa-dark/40 uppercase">
            {isEditingAdmin && isAdmin ? 'Panel Administrativo' : 'Navegación'}
          </span>
          
          <nav className="mt-2 space-y-1">
            {isEditingAdmin && isAdmin ? (
              // --- MENÚ DE ADMINISTRACIÓN ---
              <>
                <NavLink to="/admin/tableros" className={navLinkClass} onClick={alNavegar}>
                  <LayoutGrid className="w-5 h-5 shrink-0" />
                  <span>Admin. de Tableros</span>
                </NavLink>
                <NavLink to="/admin/glosario" className={navLinkClass} onClick={alNavegar}>
                  <BookOpen className="w-5 h-5 shrink-0" />
                  <span>Admin. de Glosario</span>
                </NavLink>
                <NavLink to="/admin/rutas" className={navLinkClass} onClick={alNavegar}>
                  <Database className="w-5 h-5 shrink-0" />
                  <span>Admin. de Rutas</span>
                </NavLink>
                
                {/* Gestión de Usuarios (Ruta dentro del namespace /admin/usuarios) */}
                {isFullAdmin && (
                  <NavLink to="/admin/usuarios" className={navLinkClass} onClick={alNavegar}>
                    <Users className="w-5 h-5 shrink-0" />
                    <span>Gestión de Usuarios</span>
                  </NavLink>
                )}
                
                <div className="pt-4 mt-4 border-t border-admosa-dark/10">
                  <NavLink to="/home" className={navLinkClass} onClick={alNavegar}>
                    <Home className="w-5 h-5 shrink-0 text-admosa-dark"/>
                    <span>Volver al Portal</span>
                  </NavLink>
                </div>
              </>
            ) : (
              // --- MENÚ PÚBLICO ---
              <>
                <NavLink to="/home" className={navLinkClass} onClick={alNavegar}>
                  <Home className="w-5 h-5 shrink-0" />
                  <span>Inicio</span>
                </NavLink>
                <NavLink to="/tableros" className={navLinkClass} onClick={alNavegar}>
                  <BarChart2 className="w-5 h-5 shrink-0" />
                  <span>Explorador de Tableros</span>
                </NavLink>
                <NavLink to="/rawdata" className={navLinkClass} onClick={alNavegar}>
                  <FolderBookmark className="w-5 h-5 shrink-0" />
                  <span>Carpetas</span>
                </NavLink>
                
                {isAdmin && (
                  <div className="pt-4 mt-4 border-t border-admosa-dark/10">
                    <NavLink to="/admin/tableros" className={navLinkClass} onClick={alNavegar}>
                      <Settings className="w-5 h-5 shrink-0 text-admosa-dark" />
                      <span >Panel de Administración</span>
                    </NavLink>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      </div>

      {/* SECCIÓN DE AUTENTICACIÓN Y PERFIL MEJORADA */}
      <div className="p-4 border-t border-admosa-dark/10 bg-slate-50/50">
        {user ? (
          <div className="space-y-3">
            {/* Tarjeta de Usuario con Avatar y Badge de Rol */}
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center shrink-0 shadow-sm text-base">
                {userInitial}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {user.name ? `${user.name} ${user.surname || ''}` : user.username}
                  </span>
                </div>
                
                {/* Badge Dinámico de Rol */}
                <div className="flex items-center gap-1 mt-0.5">
                  {isFullAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black bg-purple-100 text-purple-700 border border-purple-200">
                      <ShieldAlert className="w-2.5 h-2.5" />
                      FULL ADMIN
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black bg-blue-100 text-blue-700 border border-blue-200">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      ADMIN
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Botón de Cerrar Sesión */}
            <div className='grid grid-cols-2 gap-2'>
            <button 
              onClick={() => {
                logout();
                navigate('/home');
                if (alNavegar) alNavegar();
              }}
              className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 hover:bg-red-100/80 px-3 py-2 rounded-xl text-xs font-bold transition-colors border border-red-100"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
            
            <button 
                onClick={() => {
                  navigate('/admin/perfil');
                  if (alNavegar) alNavegar();
                }}
                className="w-full flex items-center justify-center gap-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 px-2 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"              >
                <UserCog className="w-3.5 h-3.5" />
                <span>Mi Perfil</span>
              </button>
            </div>
          </div>
        ) : (
          <NavLink 
            to="/login" 
            onClick={alNavegar}
            className="w-full flex items-center justify-center space-x-2 bg-slate-900 text-white hover:bg-black px-3 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>Acceso Administrativo</span>
          </NavLink>
        )}
      </div>

      {/* FOOTER */}
      <footer className="p-3.5 border-t border-admosa-dark/5 bg-admosa-gray/30 space-y-1.5 shrink-0">
        <div className="flex items-center justify-between text-[11px] text-admosa-dark/60 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C988] shadow-[0_0_4px_#00C988]"></span>
            Portal Activo v4.0
          </span>
          <span className="font-bold text-admosa-dark/40">2026</span>
        </div>
        <p className="text-[10px] text-admosa-dark/50 leading-normal text-center border-t border-admosa-dark/5 pt-1">
          División de Inteligencia de Mercados.
        </p>
      </footer>

    </aside>
  );
}