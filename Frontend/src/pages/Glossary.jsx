//página del glosario
import React, { useState, useEffect } from 'react';
import { Book, Shuffle, Loader2 } from 'lucide-react';
import { getAllDashboards, getAllSynonyms } from '../Services/api.js';

export default function Glossary() {
  const [kpis, setKpis] = useState([]);
  const [synonyms, setSynonyms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Descargamos ambos conjuntos de datos en paralelo
        const [dashboardsResult, synonymsResult] = await Promise.all([
          getAllDashboards(),
          getAllSynonyms()
        ]);

        // 1. Procesar Sinónimos
        if (!synonymsResult.error) {
          setSynonyms(synonymsResult.data || []);
        }

        // 2. Extraer KPIs únicos de todos los tableros
        if (!dashboardsResult.error && dashboardsResult.data) {
          const uniqueKpis = [];
          dashboardsResult.data.forEach(tab => {
            if (tab.kpis && Array.isArray(tab.kpis)) {
              tab.kpis.forEach(kpi => {
                if (kpi.name && !uniqueKpis.some(u => u.name.toLowerCase() === kpi.name.toLowerCase())) {
                  uniqueKpis.push(kpi);
                }
              });
            }
          });
          setKpis(uniqueKpis);
        }
      } catch (error) {
        console.error("Error al cargar datos del glosario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6 text-[#0A1F33]">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#0A1F33]/10 space-y-6">
        
        <div className="border-b border-[#0A1F33]/10 pb-4">
          <h2 className="text-xl font-bold text-[#0A1F33]">Glosario de Negocio y Diccionario</h2>
          <p className="text-sm text-[#0A1F33]/60">Consulta las métricas clave (KPIs) extraídas de los tableros y el diccionario de equivalencias sintácticas de la organización.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* TABLA DE KPIs (Acento Verde ADMOSA) */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-[#00C988]/10 rounded text-[#00C988]">
                <Book className="w-5 h-5" />
              </div>
              <h3 className="text-md font-bold text-[#0A1F33]">Glosario de KPIs Integrados</h3>
            </div>
            
            <div className="border border-[#0A1F33]/10 rounded-xl overflow-hidden shadow-sm bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F4F7F9] border-b border-[#0A1F33]/10">
                    <th className="p-3 font-semibold text-[#0A1F33]/70 w-1/3">KPI</th>
                    <th className="p-3 font-semibold text-[#0A1F33]/70">Definición de Negocio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0A1F33]/5">
                  {loading ? (
                    <tr>
                      <td colSpan="2" className="p-4 text-[#0A1F33]/40 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#00C988]" />
                          <span>Procesando métricas...</span>
                        </div>
                      </td>
                    </tr>
                  ) : kpis.length > 0 ? (
                    kpis.map((kpi, index) => (
                      <tr key={index} className="hover:bg-[#F4F7F9]/50 transition-colors">
                        <td className="p-3 font-bold text-[#0A1F33]">{kpi.name}</td>
                        <td className="p-3 text-[#0A1F33]/70 leading-normal">{kpi.definition}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="p-4 text-[#0A1F33]/40 text-center">
                        No hay KPIs disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLA DE SINÓNIMOS (Acento Azul ADMOSA) */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-[#009EE3]/10 rounded text-[#009EE3]">
                <Shuffle className="w-5 h-5" />
              </div>
              <h3 className="text-md font-bold text-[#0A1F33]">Equivalencias y Sinónimos Corporativos</h3>
            </div>
            
            <div className="border border-[#0A1F33]/10 rounded-xl overflow-hidden shadow-sm bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F4F7F9] border-b border-[#0A1F33]/10">
                    <th className="p-3 font-semibold text-[#0A1F33]/70 w-1/2">Término Coloquial / Alternativo</th>
                    <th className="p-3 font-semibold text-[#0A1F33]/70">Significado Oficial en Tableros</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0A1F33]/5">
                  {loading ? (
                    <tr>
                      <td colSpan="2" className="p-4 text-[#0A1F33]/40 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#009EE3]" />
                          <span>Cargando diccionario...</span>
                        </div>
                      </td>
                    </tr>
                  ) : synonyms.length > 0 ? (
                    synonyms.map((syn, index) => (
                      <tr key={index} className="hover:bg-[#F4F7F9]/50 transition-colors">
                        <td className="p-3 font-bold text-[#0A1F33]">{syn.termino}</td>
                        <td className="p-3 text-[#0A1F33]/70 leading-normal">{syn.significado}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="p-4 text-[#0A1F33]/40 text-center">
                        No hay sinónimos disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}