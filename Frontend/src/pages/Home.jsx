import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BotMessageSquare, LayoutGrid, Bot, BookOpen, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="p-6 max-w-6xl w-full mx-auto space-y-10 py-4 flex flex-col items-center">
        
        {/* HERO PRINCIPAL CON BIENVENIDA */}
        <div className="text-center space-y-4 relative">
          {/* Efecto de brillo de fondo sutil (Azul Institucional) */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#009EE3]/15 rounded-full blur-3xl -z-10"></div>
          
          <div className="inline-flex p-4 bg-linear-to-br from-[#009EE3]/10 to-[#6A2B86]/10 rounded-2xl shadow-sm border border-[#009EE3]/20">
            <BotMessageSquare className="w-12 h-12 text-[#009EE3] drop-shadow-sm" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-[#0A1F33] tracking-tight">
              Bienvenido a IAN
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-[#009EE3]">
              Portal y Asesor de Inteligencia Comercial
            </p>
          </div>
          
          <p className="text-[#0A1F33]/70 max-w-xl mx-auto text-sm leading-relaxed font-medium">
            Tu punto de acceso centralizado a los tableros analíticos e inteligencia de mercados de la organización. Optimiza tus consultas, unifica términos y toma decisiones respaldadas por datos vivos en la nube.
          </p>
        </div>

        {/* SECCIÓN DE MÉTRICAS RÁPIDAS DE LA ORGANIZACIÓN */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-[#0A1F33]/5 p-3 rounded-2xl border border-[#0A1F33]/10 shadow-sm backdrop-blur-sm">
          <div className="bg-white p-3.5 rounded-xl border border-[#0A1F33]/10 shadow-sm text-center">
            <span className="text-[10px] font-bold text-[#0A1F33]/50 uppercase tracking-wider block">Región</span>
            <span className="text-md font-bold text-[#0A1F33] mt-0.5 flex items-center justify-center gap-1">
              🇬🇹 🇸🇻 🇭🇳
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#0A1F33]/10 shadow-sm text-center">
            <span className="text-[10px] font-bold text-[#0A1F33]/50 uppercase tracking-wider block">Líneas Clave</span>
            <span className="text-sm font-bold text-[#0A1F33] mt-0.5 block">Motos y Autos</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#0A1F33]/10 shadow-sm text-center">
            <span className="text-[10px] font-bold text-[#0A1F33]/50 uppercase tracking-wider block">Sincronización</span>
            <span className="text-xs font-bold text-[#00C988] mt-1 flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00C988] shadow-[0_0_4px_#00C988] animate-pulse"></span> Google Sheets
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#0A1F33]/10 shadow-sm text-center">
            <span className="text-[10px] font-bold text-[#0A1F33]/50 uppercase tracking-wider block">Frecuencia</span>
            <span className="text-sm font-bold text-[#0A1F33] mt-0.5 block">Mensual / Activa</span>
          </div>
        </div>

        {/* REJILLA DE SECCIONES INTERACTIVAS (GRID MENÚ) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* TARJETA 1: EXPLORADOR (MORADO) */}
          <div 
            onClick={() => navigate('/tableros')} 
            className="bg-white border border-[#0A1F33]/10 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-[#6A2B86]/40 transition-all cursor-pointer group flex flex-col justify-between transform hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="p-3 bg-[#F4F7F9] group-hover:bg-[#6A2B86]/10 rounded-xl text-[#0A1F33]/60 group-hover:text-[#6A2B86] w-fit transition-all shadow-sm">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[#0A1F33] text-base group-hover:text-[#6A2B86] transition-colors">Explorador de Tableros</h3>
                <p className="text-xs text-[#0A1F33]/40 font-semibold tracking-wider uppercase">Fichas Técnicas y Enlaces</p>
              </div>
              <p className="text-xs text-[#0A1F33]/70 leading-relaxed">Accede al catálogo completo de directores analíticos oficiales de Microsoft SharePoint de la división. Revisa cuándo usar cada herramienta y qué preguntas responde.</p>
            </div>
            <div className="flex items-center justify-between pt-6 mt-4 border-t border-[#0A1F33]/5">
              <span className="text-xs font-bold text-[#6A2B86] flex items-center gap-1 group-hover:translate-x-1 transition-all">
                Ir al explorador 
              </span>
              <ArrowRight className="w-4 h-4 text-[#6A2B86] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* TARJETA 2: AGENTE VIRTUAL (ROSA) */}
          <div 
            onClick={() => navigate('/agente')} 
            className="bg-white border border-[#0A1F33]/10 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-[#E2007E]/40 transition-all cursor-pointer group flex flex-col justify-between transform hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="p-3 bg-[#F4F7F9] group-hover:bg-[#E2007E]/10 rounded-xl text-[#0A1F33]/60 group-hover:text-[#E2007E] w-fit transition-all shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[#0A1F33] text-base group-hover:text-[#E2007E] transition-colors">Agente Virtual IAN</h3>
                <p className="text-xs text-[#0A1F33]/40 font-semibold tracking-wider uppercase">Asesoría con IA</p>
              </div>
              <p className="text-xs text-[#0A1F33]/70 leading-relaxed">Consulta en lenguaje natural qué información necesitas y nuestro motor inteligente buscará y te recomendará instantáneamente las tarjetas y tableros comerciales ideales.</p>
            </div>
            <div className="flex items-center justify-between pt-6 mt-4 border-t border-[#0A1F33]/5">
              <span className="text-xs font-bold text-[#E2007E] flex items-center gap-1 group-hover:translate-x-1 transition-all">
                Consultar agente
              </span>
              <ArrowRight className="w-4 h-4 text-[#E2007E] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* TARJETA 3: GLOSARIO CORPORATIVO (VERDE) */}
          <div 
            onClick={() => navigate('/glosario')} 
            className="bg-white border border-[#0A1F33]/10 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-[#00C988]/40 transition-all cursor-pointer group flex flex-col justify-between transform hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="p-3 bg-[#F4F7F9] group-hover:bg-[#00C988]/10 rounded-xl text-[#0A1F33]/60 group-hover:text-[#00C988] w-fit transition-all shadow-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[#0A1F33] text-base group-hover:text-[#00C988] transition-colors">Glosario de Métricas</h3>
                <p className="text-xs text-[#0A1F33]/40 font-semibold tracking-wider uppercase">Diccionario de Sinónimos</p>
              </div>
              <p className="text-xs text-[#0A1F33]/70 leading-relaxed">Consulta la definición exacta de KPIs clave como Market Share o Alzas, y revisa la matriz de sinónimos para alinear los términos coloquiales con los reportes corporativos.</p>
            </div>
            <div className="flex items-center justify-between pt-6 mt-4 border-t border-[#0A1F33]/5">
              <span className="text-xs font-bold text-[#00C988] flex items-center gap-1 group-hover:translate-x-1 transition-all">
                Ver glosario oficial
              </span>
              <ArrowRight className="w-4 h-4 text-[#00C988] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}