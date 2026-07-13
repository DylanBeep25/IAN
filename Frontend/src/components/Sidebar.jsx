import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, BotMessageSquare, BookOpen } from 'lucide-react';

export default function Sidebar({ alNavegar }) {
  const navLinkClass = ({ isActive }) =>
    `w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
      isActive
        ? 'bg-admosa-blue/10 text-admosa-blue' 
        : 'text-admosa-dark/70 hover:bg-admosa-gray hover:text-admosa-dark' 
    }`;

  return (
    <aside className="h-full flex flex-col justify-between min-h-0 bg-white">
      
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        <div>
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-admosa-dark/40 uppercase">
            Navegación
          </span>
          
          <nav className="mt-2 space-y-1">
            {/* Ejecutamos alNavegar() en cada clic para mejorar la usabilidad móvil */}
            {/* 💡 Solo dejamos w-5 h-5 y shrink-0. El color lo dictará el navLinkClass */}
            <NavLink to="/home" className={navLinkClass} onClick={alNavegar}>
              <Home className="w-5 h-5 shrink-0" />
              <span>Inicio</span>
            </NavLink>
            
            <NavLink to="/tableros" className={navLinkClass} onClick={alNavegar}>
              <LayoutGrid className="w-5 h-5 shrink-0" />
              <span>Explorador de Tableros</span>
            </NavLink>
            
            <NavLink to="/rawdata" className={navLinkClass} onClick={alNavegar}>
              <BookOpen className="w-5 h-5 shrink-0" />
              <span>Carpeta</span>
            </NavLink>
            
            <NavLink to="/agente" className={navLinkClass} onClick={alNavegar}>
              <BotMessageSquare className="w-5 h-5 shrink-0" />
              <span>Agente Virtual IAN</span>
            </NavLink>
          </nav>
        </div>
      </div>

      <footer className="p-4 border-t border-admosa-dark/5 bg-admosa-gray/50 space-y-2 shrink-0">
        <div className="flex items-center justify-between text-[11px] text-admosa-dark/60 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C988] shadow-[0_0_4px_#00C988]"></span>
            Portal Activo beta v3.1
          </span>
          <span className="font-bold text-admosa-dark/40">2026</span>
        </div>
        <p className="text-[10px] text-admosa-dark/50 leading-normal text-center pt-1 border-t border-admosa-dark/10">
          Desarrollado para la División de Inteligencia de Mercados. Todos los derechos reservados.
        </p>
      </footer>

    </aside>
  );
}