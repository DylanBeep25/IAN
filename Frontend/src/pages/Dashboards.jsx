import React, { useState, useEffect } from 'react';
import { Search, LayoutGrid, Eye, ExternalLink, Loader2 } from 'lucide-react';
import { getAllDashboards } from '../services/api.js';
import ModalDetails from '../components/ModalDetails.jsx';
import DashboardCard from '../components/DashboardCard.jsx';

export default function Dashboards() {
  const [tableros, setTableros] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Estado para la pestaña activa
  const [pestañaActiva, setPestañaActiva] = useState('todos');
  
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
        loading && setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  // 2. Helper para convertir string "DD/MM/AAAA" a un valor comparable (Timestamp)
  const obtenerTimestamp = (fechaStr) => {
    if (!fechaStr) return 0;
    
    // Separamos "30/06/2026" por sus barras diagonales
    const partes = fechaStr.split('/');
    if (partes.length !== 3) return 0;
    
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // En JS los meses van de 0 a 11
    const anio = parseInt(partes[2], 10);
    
    return new Date(anio, mes, dia).getTime();
  };

  // 3. Lógica de Filtrado Combinada y Ordenamiento por Fecha
  const tablerosFiltradosYOrdenados = tableros
    .filter((tab) => {
      const termino = busqueda.toLowerCase();
      
      // Filtro por Buscador
      const coincideNombre = tab.nombre?.toLowerCase().includes(termino);
      const coincideDesc = tab.descripcion?.toLowerCase().includes(termino);
      const coincideTags = tab.tags?.some(tag => tag.toLowerCase().includes(termino));
      const coincideBuscador = coincideNombre || coincideDesc || coincideTags;

      // Filtro por Pestaña de Destino
      const destinoTablero = tab.destino?.toLowerCase().trim() || 'general';
      const coincidePestaña = pestañaActiva === 'todos' || destinoTablero === pestañaActiva.toLowerCase();

      return coincideBuscador && coincidePestaña;
    })
    // 📊 ORDENAMIENTO: Del más actualizado al más antiguo
    .sort((a, b) => {
      const fechaA = obtenerTimestamp(a.actualizacion);
      const fechaB = obtenerTimestamp(b.actualizacion);
      return fechaB - fechaA; // Orden descendente (más nuevo primero)
    });

  // 4. Obtener las pestañas ordenadas por prioridad de negocio
  const obtenerPestañas = () => {
    const ordenPrioridad = ['motos', 'autos', 'fuerza motriz', 'general'];
    
    const destinosUnicos = new Set();
    tableros.forEach(tab => {
      if (tab.destino) {
        destinosUnicos.add(tab.destino.trim().toLowerCase());
      }
    });

    const destinosExistentes = Array.from(destinosUnicos);

    const pestañasOrdenadas = ordenPrioridad.filter(destino => 
      destinosExistentes.includes(destino)
    );

    const pestañasExtras = destinosExistentes.filter(destino => 
      !ordenPrioridad.includes(destino)
    );

    return ['todos', ...pestañasOrdenadas, ...pestañasExtras];
  };

  const pestañasDisponibles = obtenerPestañas();

  // 5. Función para abrir el modal
  const handleAbrirDetalles = (tablero) => {
    setTableroSeleccionado(tablero);
    setModalAbierto(true);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6 text-admosa-dark">
      
      {/* Banner Principal - Degradado de Morado a Oscuro ADMOSA */}
      <div className="bg-linear-to-r from-admosa-purple to-admosa-dark text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
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
      <div className="bg-white p-4 rounded-xl shadow-sm border border-admosa-dark/10 space-y-3.5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-5 h-5 text-admosa-dark/40" />
            <input 
              type="text" 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Busca por nombre, palabras clave o métricas..." 
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-admosa-gray border border-admosa-dark/10 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-admosa-blue text-admosa-dark transition-all"
            />
          </div>
        </div>
      </div>

      {/* 📊 Selector de Pestañas (Tabs) */}
      {!loading && pestañasDisponibles.length > 1 && (
        <div className="border-b border-admosa-dark/10 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {pestañasDisponibles.map((pest) => (
            <button
              key={pest}
              onClick={() => setPestañaActiva(pest)}
              className={`px-4 py-2.5 font-semibold text-sm rounded-t-lg transition-all border-b-2 capitalize whitespace-nowrap ${
                pestañaActiva === pest
                  ? 'border-admosa-blue text-admosa-blue bg-admosa-blue/5'
                  : 'border-transparent text-admosa-dark/60 hover:text-admosa-dark hover:bg-admosa-gray'
              }`}
            >
              {pest === 'todos' ? 'Todos los Tableros' : pest}
            </button>
          ))}
        </div>
      )}

      {/* Contador de Resultados */}
      <div className="flex justify-between items-center text-xs text-admosa-dark/60 px-1 font-medium">
        <span>
          {loading 
            ? 'Cargando directorio...' 
            : `Mostrando ${tablerosFiltradosYOrdenados.length} ${tablerosFiltradosYOrdenados.length === 1 ? 'tablero' : 'tableros'}`
          }
        </span>
      </div>

      {/* Grid de Tableros */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-admosa-blue" />
          <p className="text-admosa-dark/60 text-sm font-medium">Sincronizando con la base de datos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tablerosFiltradosYOrdenados.length > 0 ? (
            tablerosFiltradosYOrdenados.map((tab) => (
              <DashboardCard
                key={tab.codigo}
                tablero={tab}
                onAbrirDetalles={handleAbrirDetalles}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-admosa-dark/10 shadow-sm">
              <Search className="w-12 h-12 text-admosa-dark/20 mx-auto mb-3" />
              <h3 className="text-admosa-dark font-bold">No se encontraron tableros</h3>
              <p className="text-admosa-dark/50 text-sm mt-1">Intenta cambiar de categoría o buscar con otros términos.</p>
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