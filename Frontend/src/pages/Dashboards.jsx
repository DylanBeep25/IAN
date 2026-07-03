//Lista todos los tableros y el buscador
import React, { useState, useEffect } from 'react';
import { Search, LayoutGrid, Eye, ExternalLink, Loader2 } from 'lucide-react';
import { getAllDashboards } from '../services/api.js';
import ModalDetails from '../components/ModalDetails.jsx';
import DashboardCard from '../components/DashboardCard.jsx';

export default function Dashboards() {
  const [tableros, setTableros] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Estados para controlar el Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tableroSeleccionado, setTableroSeleccionado] = useState(null);

  // 1. Cargar los datos al entrar a la página
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const result = await getAllDashboards();
        if (!result.error) {
          setTableros(result.data || []);
        }
      } catch (error) {
        console.error("Error cargando tableros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  // 2. Lógica del Buscador en Tiempo Real
  const tablerosFiltrados = tableros.filter((tab) => {
    const termino = busqueda.toLowerCase();
    const coincideNombre = tab.nombre?.toLowerCase().includes(termino);
    const coincideDesc = tab.descripcion?.toLowerCase().includes(termino);
    const coincideTags = tab.tags?.some(tag => tag.toLowerCase().includes(termino));
    
    return coincideNombre || coincideDesc || coincideTags;
  });

  // 3. Función para abrir el modal
  const handleAbrirDetalles = (tablero) => {
    setTableroSeleccionado(tablero);
    setModalAbierto(true);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6 text-[#0A1F33]">
      
      {/* Banner Principal - Degradado de Morado a Oscuro ADMOSA */}
      <div className="bg-linear-to-r from-[#6A2B86] to-[#0A1F33] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-bold">Ubica tu Tablero de Inteligencia</h2>
          <p className="mt-1.5 text-white/80 text-sm leading-relaxed">
            Encuentra los enlaces, indicadores, palabras clave, preguntas de negocio y guías de uso de todos los tableros analíticos de la división.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <LayoutGrid className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#0A1F33]/10 space-y-3.5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-5 h-5 text-[#0A1F33]/40" />
            <input 
              type="text" 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Busca por nombre, palabras clave o métricas..." 
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-[#F4F7F9] border border-[#0A1F33]/10 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#009EE3] text-[#0A1F33] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Contador de Resultados */}
      <div className="flex justify-between items-center text-xs text-[#0A1F33]/60 px-1 font-medium">
        <span>
          {loading 
            ? 'Cargando directorio...' 
            : `Mostrando ${tablerosFiltrados.length} ${tablerosFiltrados.length === 1 ? 'tablero' : 'tableros'}`
          }
        </span>
      </div>

      {/* Grid de Tableros */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          {/* Spinner Azul Institucional */}
          <Loader2 className="w-10 h-10 animate-spin text-[#009EE3]" />
          <p className="text-[#0A1F33]/60 text-sm font-medium">Sincronizando con la base de datos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tablerosFiltrados.length > 0 ? (
            tablerosFiltrados.map((tab) => (
              <DashboardCard
                key={tab.codigo}
                tablero={tab}
                onAbrirDetalles={handleAbrirDetalles}
              />
            ))
          ) : (
            // Estado vacío
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-[#0A1F33]/10 shadow-sm">
              <Search className="w-12 h-12 text-[#0A1F33]/20 mx-auto mb-3" />
              <h3 className="text-[#0A1F33] font-bold">No se encontraron tableros</h3>
              <p className="text-[#0A1F33]/50 text-sm mt-1">Intenta buscar con otros términos o palabras clave.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <ModalDetails 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        tablero={tableroSeleccionado} 
      />

    </div>
  );
}