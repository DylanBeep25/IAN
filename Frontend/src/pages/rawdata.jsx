import React, { useState, useEffect } from 'react';
import { Search, Database, ExternalLink, Loader2, FolderDown, Ban } from 'lucide-react';
// Asegúrate de importar la función que crearemos en el paso 2
import { getRawData } from '../services/api.js'; 

export default function RawData() {
  const [carpetas, setCarpetas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar los datos al entrar a la página
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const result = await getRawData();
        if (!result.error) {
          setCarpetas(result.data || []);
        }
      } catch (error) {
        console.error("Error cargando raw data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  // Lógica del buscador
  const carpetasFiltradas = carpetas.filter((item) => {
    const termino = busqueda.toLowerCase();
    const coincideNombre = item.nombre?.toLowerCase().includes(termino);
    const coincideTablero = item.tablero?.toLowerCase().includes(termino);
    return coincideNombre || coincideTablero;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6 text-admosa-dark">
      
      {/* Banner Principal - Variación de color para diferenciarlo de los Tableros */}
      <div className="bg-linear-to-r from-admosa-blue to-admosa-dark text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-bold flex items-center gap-3">
            <Database className="w-8 h-8" />
            Repositorio de Datos
          </h2>
          <p className="mt-1.5 text-white/80 text-sm leading-relaxed">
            Accede a las carpetas de origen y archivos planos (Raw Data) que alimentan los tableros de inteligencia comercial.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-8">
          <FolderDown className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-admosa-dark/10 space-y-3.5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-5 h-5 text-admosa-dark/40" />
            <input 
              type="text" 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Busca por nombre de carpeta o tablero relacionado..." 
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-admosa-gray border border-admosa-dark/10 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-admosa-blue text-admosa-dark transition-all"
            />
          </div>
        </div>
      </div>

      {/* Contador */}
      <div className="flex justify-between items-center text-xs text-admosa-dark/60 px-1 font-medium">
        <span>
          {loading 
            ? 'Cargando directorio de carpetas...' 
            : `Mostrando ${carpetasFiltradas.length} ${carpetasFiltradas.length === 1 ? 'fuente' : 'fuentes'}`
          }
        </span>
      </div>

      {/* Tabla Responsiva */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-admosa-blue" />
          <p className="text-admosa-dark/60 text-sm font-medium">Sincronizando orígenes de datos...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-admosa-dark/10 shadow-sm overflow-hidden">
          {/* overflow-x-auto permite que la tabla se deslice hacia los lados en celulares sin romper la pantalla */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-admosa-gray/70 border-b border-admosa-dark/10 text-[10px] uppercase tracking-wider text-admosa-dark/50 font-bold">
                  <th className="p-4 w-1/3">Nombre de la Carpeta</th>
                  <th className="p-4 w-1/2">Tablero que Alimenta</th>
                  <th className="p-4 w-auto text-center">Acceso</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {carpetasFiltradas.length > 0 ? (
                  carpetasFiltradas.map((carpeta, index) => {
                    
                    // Verificamos si el link es válido (existe, no está vacío y no es un simple "#")
                    const linkValido = carpeta.link && carpeta.link.trim() !== "" && carpeta.link.trim() !== "#";

                    return (
                      <tr 
                        key={index} 
                        className="border-b border-admosa-dark/5 hover:bg-admosa-gray/30 transition-colors group"
                      >
                        <td className="p-4 font-semibold text-admosa-dark flex items-center gap-2">
                          <FolderDown className="w-4 h-4 text-admosa-blue shrink-0" />
                          <span className="whitespace-nowrap">{carpeta.nombre}</span>
                        </td>
                        <td className="p-4 text-admosa-dark/70">
                          {carpeta.tablero}
                        </td>
                        <td className="p-4 text-center">
                          {/* 💡 Renderizado condicional del botón basado en la validez del link */}
                          {linkValido ? (
                            <a 
                              href={carpeta.link} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 bg-admosa-blue/10 hover:bg-admosa-blue text-admosa-blue hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap"
                            >
                              Abrir <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <button 
                              disabled
                              title="Enlace no disponible o en mantenimiento."
                              className="inline-flex items-center justify-center gap-1.5 bg-admosa-dark/5 text-admosa-dark/30 px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap cursor-not-allowed"
                            >
                              No Disponible <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" className="py-12 text-center">
                      <Database className="w-10 h-10 text-admosa-dark/20 mx-auto mb-3" />
                      <p className="text-admosa-dark font-bold">No se encontraron carpetas</p>
                      <p className="text-admosa-dark/50 text-xs mt-1">Verifica los términos de tu búsqueda.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}