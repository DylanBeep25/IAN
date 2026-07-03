//Tarjeta de información
import React from 'react';
import { Eye, ExternalLink, BarChart3 } from 'lucide-react'; // Añadimos BarChart3 para un toque analítico

export default function DashboardCard({ tablero, onAbrirDetalles }) {
  return (
    // Contenedor principal con overflow-hidden para la línea de color superior
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden border border-[#0A1F33]/5">
      
      {/* Línea superior con el degradado corporativo ADMOSA */}
      <div className="h-1.5 w-full bg-linear-to-r from-[#009EE3] via-[#6A2B86] to-[#E2007E]"></div>
      
      <div className="p-5 flex-1 flex flex-col">
        {/* Cabecera de la tarjeta */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#F4F7F9] rounded-lg text-[#009EE3]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#F4F7F9] text-[#0A1F33]/60 border border-[#0A1F33]/10">
              {tablero.codigo}
            </span>
          </div>
          {/* Badge del país */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#009EE3] bg-[#009EE3]/10 px-2.5 py-1 rounded-full">
            {tablero.pais}
          </span>
        </div>
        
        {/* Título y Descripción */}
        <h3 className="font-extrabold text-[#0A1F33] text-lg leading-tight group-hover:text-[#009EE3] transition-colors mb-2">
          {tablero.nombre}
        </h3>
        
        <p className="text-xs text-[#0A1F33]/60 leading-relaxed line-clamp-3 mb-4 flex-1">
          {tablero.descripcion}
        </p>
        
        {/* Etiquetas con un diseño más sutil y un separador superior */}
        {tablero.tags && tablero.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#0A1F33]/5 mt-auto">
            {tablero.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[9px] font-semibold text-[#0A1F33]/50 uppercase tracking-widest bg-[#F4F7F9] px-2 py-1 rounded-md border border-[#0A1F33]/5">
                {tag}
              </span>
            ))}
            {tablero.tags.length > 3 && (
              <span className="text-[9px] font-bold text-[#0A1F33]/40 px-1 py-1">
                +{tablero.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Botonera con contraste y mejor jerarquía visual */}
      <div className="flex items-center gap-3 p-4 bg-[#F4F7F9]/50 border-t border-[#0A1F33]/5">
        
        {/* Botón secundario (Blanco con borde) */}
        <button 
          onClick={() => onAbrirDetalles(tablero)}
          className="flex-1 text-[11px] font-bold text-[#0A1F33]/70 hover:text-[#0A1F33] bg-white hover:bg-slate-50 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 border border-[#0A1F33]/10 shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Ficha Técnica</span>
        </button>
        
        {/* Botón primario (Sólido Morado para el Action Call) */}
        <a 
          href={tablero.url} 
          target="_blank" 
          rel="noreferrer"
          className="flex-1 text-[11px] font-bold text-white bg-[#4a5eae] hover:bg-[#57236D] py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
        >
          <span>Abrir Reporte</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      
    </div>
  );
}