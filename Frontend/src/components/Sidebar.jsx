//Menú lateral
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, BotMessageSquare, BookOpen } from 'lucide-react';

export default function Sidebar() {
  const navLinkClass = ({ isActive }) =>
    `w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#009EE3]/10 text-[#009EE3]' 
        : 'text-[#0A1F33]/70 hover:bg-[#F4F7F9] hover:text-[#0A1F33]' 
    }`;

  return (
    // ¡Aquí está la magia! Solo h-full y flex-col, el MainPage controla el resto
    <aside className="h-full flex flex-col justify-between">
      
      {/* Bloque superior de la barra lateral */}
      <div className="p-4 space-y-6">
        <div>
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#0A1F33]/40 uppercase">
            Navegación
          </span>
          
          <nav className="mt-2 space-y-1">
            <NavLink to="/home" className={navLinkClass}>
              <Home className="w-5 h-5 text-[#009EE3]" />
              <span>Inicio</span>
            </NavLink>
            
            <NavLink to="/tableros" className={navLinkClass}>
              <LayoutGrid className="w-5 h-5 text-[#6A2B86]" />
              <span>Explorador de Tableros</span>
            </NavLink>
            
            <NavLink to="/agente" className={navLinkClass}>
              <BotMessageSquare className="w-5 h-5 text-[#E2007E]" />
              <span>Agente Virtual IAN</span>
            </NavLink>
            
            <NavLink to="/glosario" className={navLinkClass}>
              <BookOpen className="w-5 h-5 text-[#00C988]" />
              <span>Glosario y Sinónimos</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Footer de la barra lateral */}
      <footer className="p-4 border-t border-[#0A1F33]/5 bg-[#F4F7F9]/50 space-y-2 shrink-0">
        <div className="flex items-center justify-between text-[11px] text-[#0A1F33]/60 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C988] shadow-[0_0_4px_#00C988]"></span>
            Portal Activo beta v3.0
          </span>
          <span className="font-bold text-[#0A1F33]/40">2026</span>
        </div>
        <p className="text-[10px] text-[#0A1F33]/50 leading-normal text-center pt-1 border-t border-[#0A1F33]/10">
          Desarrollado para la División de Inteligencia de Mercados. Todos los derechos reservados.
        </p>
      </footer>

    </aside>
  );
}