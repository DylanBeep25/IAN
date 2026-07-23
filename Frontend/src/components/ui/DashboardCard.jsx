import React from 'react';
import { Eye, ExternalLink, BarChart3 } from 'lucide-react';

export default function DashboardCard({ tablero, onAbrirDetalles }) {
  return (
    // "w-full" asegura que ocupe el 100% del espacio que le asigne la columna del grid
    // 🛠️ CORREGIDO: "border border-admosa-dark/5" (Quitamos la doble 'b')
    <div className="w-full bg-white rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden border border-admosa-dark/5 min-h-47.5">
      
      {/* Línea superior ADMOSA */}
      <div className="h-1 w-full bg-linear-to-r from-admosa-blue via-admosa-purple to-admosa-pink"></div>
      
      {/* Reducimos el padding a p-3.5 para que respire bien en columnas angostas */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Cabecera optimizada en espacio */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1">
              <div className="p-1 bg-admosa-gray rounded text-admosa-blue">
                <BarChart3 className="w-3 h-3" />
              </div>
              <span className="px-1 py-0.5 text-[8px] font-bold rounded bg-admosa-gray text-admosa-dark/60 border border-admosa-dark/10 truncate max-w-45">
                Actualización: {tablero.actualizacion}
              </span>
            </div>
            <span className="text-[8px] font-bold uppercase tracking-wider text-admosa-blue bg-admosa-blue/10 px-1.5 py-0.5 rounded-full truncate max-w-16.25">
              {tablero.pais}
            </span>
          </div>
          
          {/* Título: Usa "truncate" para que si es muy largo no salte de línea y arruine el alto de la fila */}
          <h3 className="font-extrabold text-admosa-dark text-sm leading-tight group-hover:text-admosa-blue transition-colors mb-1 truncate" title={tablero.nombre}>
            {tablero.nombre}
          </h3>
          
          {/* Descripción: Limitada estrictamente a 2 líneas */}
          <p className="text-[11px] text-admosa-dark/60 leading-snug line-clamp-2 mb-2">
            {tablero.descripcion}
          </p>
        </div>
        
        {/* Etiquetas */}
        {tablero.tags && tablero.tags.length > 0 && (
          // 🛠️ CORREGIDO: "border-t border-admosa-dark/5" (Faltaba la palabra border-)
          <div className="flex flex-wrap gap-1 pt-2 border-t border-admosa-dark/5 mt-2">
            {tablero.tags.slice(0, 2).map((tag, i) => (
              // 🛠️ CORREGIDO: "border border-admosa-dark/10" (Cambiamos text- por border-)
              <span key={i} className="text-[8px] font-semibold text-admosa-dark/50 uppercase bg-admosa-gray px-1.5 py-0.5 rounded border border-admosa-dark/10 truncate max-w-13.75">
                {tag}
              </span>
            ))}
            {tablero.tags.length > 2 && (
              <span className="text-[8px] font-bold text-admosa-dark/40 align-middle pt-0.5">
                +{tablero.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Botonera */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-admosa-gray/50 border-t border-admosa-dark/5">
        <button 
          onClick={() => onAbrirDetalles(tablero)}
          className="flex-1 text-[10px] font-bold text-admosa-dark/70 hover:text-admosa-dark bg-white hover:bg-slate-50 py-1.5 rounded-md transition-all flex items-center justify-center gap-1 border border-admosa-dark/10"
        >
          <Eye className="w-3 h-3 text-admosa-dark/50" />
          <span>Ficha</span>
        </button>
        
        <a 
          href={tablero.url} 
          target="_blank" 
          rel="noreferrer"
          className="flex-1 text-[10px] font-bold text-white bg-[#4a5eae] hover:bg-[#57236D] py-1.5 rounded-md transition-all flex items-center justify-center gap-1"
        >
          <span>Reporte</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}