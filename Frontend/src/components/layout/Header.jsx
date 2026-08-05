import React from 'react';
import { Construction, Menu, X } from 'lucide-react';
import ADMOSA_LOGO_blanco from'../../assets/ADMOSA_LOGO_blanco.png'
import GI from '../../assets/GI_dos.png'


export default function Header({ onToggleSidebar, isSidebarOpen }) {
  return (
    <header className="bg-admosa-dark text-white shadow-md shrink-0 border-b border-admosa-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 relative">
        
        {/* 🍔 Botón Hamburguesa */}
        <button 
          onClick={onToggleSidebar}
          className="absolute left-4 top-5 p-1.5 rounded-md bg-white/5 border border-white/10 text-white md:hidden hover:bg-white/10 active:scale-95 transition-all z-10"
          aria-label="Abrir menú"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* 1. Logo ADMOSA (Izquierda) */}
        <div className="shrink-0 pl-8 md:pl-0">
          <a href="/">
            <img 
              src={ADMOSA_LOGO_blanco}
              alt="Logo Empresa" 
              className="w-36 sm:w-30 h-auto object-contain" 
            />
          </a>
        </div>
        
        {/* 2. IAN (Centrado Absoluto en Desktop, Centrado Normal en Móvil) */}
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center space-x-3 text-center md:text-left">
          <div className="shrink-0">
            <img 
              src={GI}
              alt="Logo IAN" 
              className="w-8 sm:w-12 h-auto object-contain" 
            />
          </div>
          <div>
            <h1 className="text-sm sm:text-xl font-bold leading-tight">
              IAN — Directorio Inteligente
            </h1>
            <p className="text-[9px] sm:text-xs text-admosa-blue font-semibold">
              Portal y Agente de Búsqueda de Tableros Comerciales
            </p>
          </div>
        </div>

        {/* 3. Indicador de Estado (Derecha) */}
        <div className="flex items-center shrink-0">
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs bg-white/10 px-3 py-1.5 rounded-full text-admosa-gray border border-white/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#00C988] shadow-[0_0_8px_#00C988] animate-pulse"></span>
            <span>Base de Datos en la Nube Activa</span>
          </div>
        </div>

      </div>

      {/* Barra de estado inferior */}
      <div className="bg-linear-to-r from-admosa-blue via-admosa-purple to-admosa-pink text-white text-[10px] sm:text-[11px] font-bold py-2 px-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 shadow-sm relative text-center">
        <div className="flex items-center gap-1.5 justify-center">
          <Construction className="w-3.5 h-3.5 animate-bounce shrink-0" />
          <span>Entorno de Pruebas:</span>
        </div>
        <span className="font-medium text-white/90">
          Esta plataforma se encuentra en desarrollo activo.
        </span>
        <span className="bg-admosa-dark/30 px-1.5 py-0.5 rounded-md text-[9px] uppercase tracking-wider border border-white/20 whitespace-nowrap">
          Versión Beta 4.0
        </span>
      </div>
    </header>
  );
}
