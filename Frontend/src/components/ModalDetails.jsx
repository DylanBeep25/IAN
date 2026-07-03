//Ficha técnica del tablero
import React from 'react';
import { X, Link2, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ModalDetails({ isOpen, onClose, tablero }) {
  // Si no está abierto o no hay datos, no renderizamos nada
  console.log("Datos del tablero recibidos en Modal:", tablero);
  if (!isOpen || !tablero) return null;

  // Función para cerrar si hacen clic en el fondo oscuro
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Backdrop usando el color oscuro ADMOSA con opacidad
    <div 
      className="fixed inset-0 bg-[#0A1F33]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      {/* Contenedor principal del Modal */}
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#0A1F33]/10 flex flex-col custom-scrollbar">
        
        {/* Sticky Header */}
        <div className="p-5 border-b border-[#0A1F33]/10 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 text-xs font-bold rounded bg-[#009EE3]/10 text-[#009EE3]">
              {tablero.codigo}
            </span>
            <h3 className="text-lg font-bold text-[#0A1F33]">{tablero.nombre}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-[#F4F7F9] rounded-full text-[#0A1F33]/40 hover:text-[#0A1F33]/80 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6 space-y-6">
          
          {/* Grid de Metadatos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F4F7F9] rounded-xl border border-[#0A1F33]/5 text-xs">
            <div>
              <span className="text-[#0A1F33]/50 block mb-0.5 font-medium">País</span>
              <span className="font-bold text-[#0A1F33]">{tablero.pais}</span>
            </div>
            <div>
              <span className="text-[#0A1F33]/50 block mb-0.5 font-medium">Área Propietaria</span>
              <span className="font-bold text-[#0A1F33]">{tablero.area || 'Inteligencia Comercial'}</span>
            </div>
            <div>
              <span className="text-[#0A1F33]/50 block mb-0.5 font-medium">Actualización</span>
              <span className="font-bold text-[#0A1F33]">{tablero.frecuencia}</span>
            </div>
            <div>
              <span className="text-[#0A1F33]/50 block mb-0.5 font-medium">Responsable</span>
              <span className="font-bold text-[#0A1F33]">{tablero.responsable}</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F33]/40">Descripción del Directorio</h4>
            <p className="text-sm text-[#0A1F33]/70 leading-relaxed">{tablero.descripcion}</p>
          </div>

          {/* Banner de Enlace - Azul ADMOSA */}
          <div className="p-4 bg-[#009EE3]/5 border border-[#009EE3]/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3 text-[#0A1F33]">
              <Link2 className="w-6 h-6 text-[#009EE3]" />
              <div>
                <span className="text-xs font-bold block">Enlace al tablero en Power BI online</span>
                <span className="text-[11px] text-[#009EE3] font-medium leading-tight">Acceso directo al directorio oficial de Power BI</span>
              </div>
            </div>
            <a 
              href={tablero.url} 
              target="_blank" 
              rel="noreferrer" 
              className="w-full sm:w-auto text-center px-4 py-2 text-xs font-bold text-white bg-[#009EE3] hover:bg-[#009EE3]/90 rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ir al Tablero Oficial</span>
            </a>
          </div>

          {/* Reglas de Uso */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Verde Institucional para USAR */}
            <div className="p-4 bg-[#00C988]/5 border border-[#00C988]/20 rounded-xl space-y-2.5">
              <span className="text-xs font-bold text-[#0A1F33] flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00C988]" />
                <span>Cuándo USAR este tablero</span>
              </span>
              <ul className="text-xs text-[#0A1F33]/70 space-y-1.5 list-disc pl-4 leading-normal">
                {tablero.cuandoUsar?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Rosa Institucional para NO USAR */}
            <div className="p-4 bg-[#E2007E]/5 border border-[#E2007E]/20 rounded-xl space-y-2.5">
              <span className="text-xs font-bold text-[#0A1F33] flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-[#E2007E]" />
                <span>Cuándo NO USAR este tablero</span>
              </span>
              <ul className="text-xs text-[#0A1F33]/70 space-y-1.5 list-disc pl-4 leading-normal">
                {tablero.cuandoNoUsar?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Preguntas de Negocio - Acento Morado */}
          {tablero.preguntas?.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F33]/40">Preguntas de Negocio que Responde</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#0A1F33]/70">
                {tablero.preguntas.map((pregunta, i) => (
                  <div key={i} className="flex items-start gap-1.5 p-2 bg-[#F4F7F9] rounded-lg border border-[#0A1F33]/5">
                    <span className="text-[#6A2B86] font-bold">•</span>
                    <span>{pregunta}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabla de KPIs */}
          {tablero.kpis?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F33]/40">Métricas y KPIs Soportados</h4>
              <div className="border border-[#0A1F33]/10 rounded-xl overflow-hidden text-xs bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F4F7F9] border-b border-[#0A1F33]/10">
                      <th className="p-2.5 font-semibold text-[#0A1F33]/70 w-1/3">KPI</th>
                      <th className="p-2.5 font-semibold text-[#0A1F33]/70">Definición de Negocio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0A1F33]/5">
                    {tablero.kpis.map((kpi, i) => (
                      <tr key={i} className="hover:bg-[#F4F7F9]/50 transition-colors">
                        <td className="p-2.5 font-bold text-[#0A1F33]">{kpi.name}</td>
                        <td className="p-2.5 text-[#0A1F33]/70 leading-normal">{kpi.definition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tags */}
          {tablero.keywords?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F33]/40">Palabras Clave de Búsqueda</h4>
              <div className="flex flex-wrap gap-1.5">
                {tablero.keywords.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[#F4F7F9] text-[#0A1F33]/50 rounded-md text-[10px] font-bold uppercase tracking-wider border border-[#0A1F33]/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}