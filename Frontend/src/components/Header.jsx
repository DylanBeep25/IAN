import React from 'react';
import { Construction } from 'lucide-react';

export default function Header() {
  return (
    // Fondo Oscuro de ADMOSA (#0A1F33)
    <header className="bg-[#0A1F33] text-white shadow-md shrink-0 z-20 border-b border-[#0A1F33]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo de la Empresa */}
        <div>
          <img src="https://lh3.googleusercontent.com/u/0/d/1wd_FPwhJrZ80VYLrKDv1emWydYqXtwXw" alt="Logo Empresa" width="200px" />
        </div>
        
        {/* Logo IAN y Títulos */}
        <div className="flex items-center space-x-3">
          <div>
            <img src="https://lh3.googleusercontent.com/u/0/d/1GI5_ns0hhqfKxSqRQwGhici4-AZyjX5J" alt="Logo IAN" width="50px" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">IAN — Directorio Inteligente</h1>
            {/* Subtítulo con el Azul Institucional */}
            <p className="text-xs text-[#009EE3] font-semibold">Portal y Agente de Búsqueda de Tableros Comerciales</p>
          </div>
        </div>

        {/* Indicador de Estado */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-xs bg-white/10 px-3 py-1.5 rounded-full text-[#F4F7F9] border border-white/5 backdrop-blur-sm">
            {/* El nuevo Verde para indicar "En Línea" con un brillo sutil */}
            <span className="w-2 h-2 rounded-full bg-[#00C988] shadow-[0_0_8px_#00C988] animate-pulse"></span>
            <span>Base de Datos en la Nube Activa</span>
          </div>
        </div>
      </div>

      {/* Barra de estado con degradado institucional: Azul -> Morado -> Rosa */}
      <div className="bg-linear-to-r from-[#009EE3] via-[#6A2B86] to-[#E2007E] text-white text-[11px] font-bold py-1.5 px-4 flex items-center justify-center gap-2 shadow-sm select-none z-30 relative">
        <Construction className="w-3.5 h-3.5 animate-bounce" />
        <span>Entorno de Pruebas:</span>
        <span className="font-medium text-white/90">Esta plataforma se encuentra en desarrollo activo.</span>
        <span className="bg-[#0A1F33]/30 px-1.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider border border-white/20">
          Versión Beta 3.0
        </span>
      </div>
    </header>
  );
}