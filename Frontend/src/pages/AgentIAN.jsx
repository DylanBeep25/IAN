import React, { useState, useRef, useEffect } from 'react';
import { BotMessageSquare, Bot, Send, Trash2, User, Info, ExternalLink } from 'lucide-react';
import { getRecommendations } from '../services/api.js';

export default function AgentIAN() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'agent',
      text: '¡Hola! Soy el agente IAN. Estoy entrenado con los directorios, KPIs, sinónimos corporativos y preguntas frecuentes de todos los tableros. Dime qué tipo de información estás buscando.',
      recommendedTableros: []
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSetChatQuery = (text) => {
    setQuery(text);
    const inputEl = document.getElementById('chat-input');
    if (inputEl) inputEl.focus();
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'agent',
        text: '¡Historial de asesoría limpio! Escribe tu consulta o haz click en los atajos para comenzar de nuevo a buscar tu tablero ideal.',
        recommendedTableros: []
      }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userPrompt = query.trim();
    setQuery('');
    
    setMessages(prev => [...prev, { role: 'user', text: userPrompt }]);
    setIsTyping(true);

    try {
      const result = await getRecommendations(userPrompt);

      if (!result.error && result.respuesta) {
        const formattedMessage = result.respuesta.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        setMessages(prev => [...prev, {
          role: 'agent',
          text: formattedMessage,
          recommendedTableros: result.recomendaciones || []
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'agent',
          text: 'Lo siento, no logro establecer conexión con el motor analítico en el backend.'
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'agent',
        text: 'Ocurrió un error inesperado al procesar tu solicitud.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6 text-admosa-dark">
      
      {/* CONTENEDOR PRINCIPAL DEL CHAT Y SIDEBAR */}
      <div className="flex flex-col lg:flex-row overflow-hidden w-full h-[calc(100vh-160px)] bg-white rounded-2xl shadow-sm border border-admosa-dark/10">
        
        {/* COLUMNA PRINCIPAL DEL CHAT */}
        <div className="flex-1 flex flex-col overflow-hidden h-full order-1">
          
          {/* Header del Chat */}
          <div className="p-4 border-b border-admosa-dark/10 flex items-center justify-between bg-admosa-gray/50 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-admosa-blue/10 rounded-full flex items-center justify-center text-admosa-blue shadow-sm">
                <BotMessageSquare className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-admosa-dark">IAN-Agent</h3>
                <p className="text-[11px] text-admosa-purple font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C988] animate-pulse"></span>
                  Asesor de Directorios Activo
                </p>
              </div>
            </div>
            <button 
              onClick={handleClearChat} 
              className="text-xs text-admosa-dark/50 hover:text-admosa-dark flex items-center space-x-1 p-1.5 rounded-md hover:bg-admosa-gray transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Limpiar Historial</span>
            </button>
          </div>

          {/* Historial de Mensajes */}
          <div id="chat-messages" className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-4 custom-scrollbar bg-admosa-gray/20">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex items-start space-x-2 sm:space-x-3 max-w-[92%] sm:max-w-[85%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Icono */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  msg.role === 'user' 
                    ? 'bg-admosa-blue/10 text-admosa-blue border-admosa-blue/20' 
                    : 'bg-admosa-purple/10 text-admosa-purple border-admosa-purple/20'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Burbuja */}
                <div className={`p-3 sm:p-4 rounded-2xl shadow-xs text-xs sm:text-sm leading-relaxed flex flex-col space-y-2 w-full ${
                  msg.role === 'user' 
                    ? 'bg-admosa-blue text-white rounded-tr-none' 
                    : 'bg-white text-admosa-dark border border-admosa-dark/10 rounded-tl-none'
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} className="wrap-break-word" />

                  {/* Grid dinámico de recursos recomendados (Tableros o RawData) */}
                  {msg.recommendedTableros && msg.recommendedTableros.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 w-full">
                      {msg.recommendedTableros.map((item, idx) => {
                        // Identificamos si es un Tablero o Raw Data
                        const esRawData = !!item.nombreCarpeta;
                        const titulo = item.nombre || item.nombreCarpeta || 'Recurso Sugerido';
                        const codigo = item.codigo || (esRawData ? 'RAW-DATA' : 'INFO');
                        const etiqueta = item.pais || (esRawData ? 'Carpeta / Archivo' : 'General');
                        const enlace = item.url || '#';

                        return (
                          <div key={item._id || item.codigo || idx} className="bg-admosa-gray/30 border border-admosa-dark/5 p-3 rounded-xl shadow-xs flex flex-col justify-between space-y-2.5 text-left w-full overflow-hidden">
                            <div>
                              <div className="flex items-center justify-between text-[9px]">
                                <span className="font-extrabold text-admosa-dark/40">{codigo}</span>
                                <span className="font-bold px-1.5 py-0.5 rounded-full bg-white text-admosa-blue border border-admosa-blue/10 uppercase tracking-wider">{etiqueta}</span>
                              </div>
                              <h4 className="font-bold text-admosa-dark text-xs mt-1 truncate" title={titulo}>{titulo}</h4>
                              <p className="text-[11px] text-admosa-dark/60 mt-0.5 line-clamp-2 leading-tight">
                                {item.descripcion || item.resumenIA || 'Sin descripción disponible.'}
                              </p>
                            </div>
                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-admosa-dark/5">
                              <button className="text-[10px] text-admosa-purple font-bold hover:underline flex items-center gap-0.5">
                                <Info className="w-3 h-3" />
                                <span>Detalles</span>
                              </button>
                              {enlace !== '#' && (
                                <a 
                                  href={enlace} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-[10px] bg-admosa-blue hover:bg-admosa-blue/90 text-white font-bold px-2 py-1 rounded-md flex items-center gap-1 transition-all"
                                >
                                  <span>Acceder</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Indicador de escritura */}
          {isTyping && (
            <div className="px-4 py-2 flex items-center space-x-2 text-xs text-admosa-dark/40 shrink-0 bg-white border-t border-admosa-dark/5">
              <span className="w-1.5 h-1.5 rounded-full bg-admosa-blue animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-admosa-blue animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-admosa-blue animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              <span className="font-medium">IAN está analizando tu solicitud...</span>
            </div>
          )}

          {/* Input Form */}
          <div className="p-3 border-t border-admosa-dark/10 bg-white shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-7xl mx-auto w-full">
              <input 
                type="text" 
                id="chat-input" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Escribe tu consulta..." 
                className="flex-1 px-3 sm:px-4 py-2.5 text-xs sm:text-sm bg-admosa-gray/50 border border-admosa-dark/10 rounded-xl focus:ring-2 focus:ring-admosa-blue focus:outline-none transition-all text-admosa-dark placeholder-admosa-dark/40"
                disabled={isTyping}
              />
              <button 
                type="submit" 
                disabled={isTyping || !query.trim()}
                className="bg-admosa-blue hover:bg-admosa-blue/90 disabled:opacity-40 text-white px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center shrink-0"
              >
                <Send className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </form>
          </div>

        </div>

        {/* PANEL LATERAL DE ATAJOS */}
        <div className="w-full lg:w-80 p-4 bg-admosa-gray flex flex-col space-y-4 overflow-y-auto shrink-0 border-t lg:border-t-0 lg:border-l border-admosa-dark/10 order-2 max-h-[35%] lg:max-h-none">
          <h4 className="text-xs font-bold uppercase tracking-wider text-admosa-dark/40">Atajos del Asesor</h4>
          
          <div className="bg-white p-3 rounded-xl border border-admosa-dark/5 shadow-xs space-y-2 shrink-0">
            <span className="text-xs font-bold text-admosa-dark block">Consultas Rápidas</span>
            <div className="space-y-1">
              <button onClick={() => handleSetChatQuery('¿Cuál tablero muestra los precios de motocicletas en la región?')} className="w-full text-left text-xs text-admosa-dark/70 hover:text-admosa-blue hover:underline p-1 block truncate transition-colors">¿Precios de motocicletas?</button>
              <button onClick={() => handleSetChatQuery('¿Dónde puedo ver licitaciones vigentes en Guatemala?')} className="w-full text-left text-xs text-admosa-dark/70 hover:text-admosa-blue hover:underline p-1 block truncate transition-colors">¿Licitaciones vigentes?</button>
              <button onClick={() => handleSetChatQuery('¿Qué tablero analiza el mercado de autos nuevos en Guatemala?')} className="w-full text-left text-xs text-admosa-dark/70 hover:text-admosa-blue hover:underline p-1 block truncate transition-colors">¿Mercado de autos de agencia?</button>
              <button onClick={() => handleSetChatQuery('Necesito un tablero para monitorear precios de fuerza motriz')} className="w-full text-left text-xs text-admosa-dark/70 hover:text-admosa-blue hover:underline p-1 block truncate transition-colors">¿Precios fuerza motriz?</button>
            </div>
          </div>

          <div className="bg-admosa-purple/5 p-3 rounded-xl border border-admosa-purple/10 space-y-2 shrink-0">
            <span className="text-xs font-bold text-admosa-purple block">Comprensión de Sinónimos</span>
            <p className="text-[11px] text-admosa-dark/70 leading-normal">El IAN-Agent traduce automáticamente tus términos a vocabulario técnico oficial:</p>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <div className="bg-white p-1.5 rounded-lg text-[10px] border border-admosa-purple/10 text-admosa-dark/80 flex justify-between"><strong className="text-admosa-purple">Usado</strong> <span className="text-admosa-dark/30">➔</span> Rodado</div>
              <div className="bg-white p-1.5 rounded-lg text-[10px] border border-admosa-purple/10 text-admosa-dark/80 flex justify-between"><strong className="text-admosa-purple">Nuevo</strong> <span className="text-admosa-dark/30">➔</span> Agencia</div>
              <div className="bg-white p-1.5 rounded-lg text-[10px] border border-admosa-purple/10 text-admosa-dark/80 flex justify-between"><strong className="text-admosa-purple">Ventas</strong> <span className="text-admosa-dark/30">➔</span> Alzas</div>
              <div className="bg-white p-1.5 rounded-lg text-[10px] border border-admosa-purple/10 text-admosa-dark/80 flex justify-between"><strong className="text-admosa-purple">Sport</strong> <span className="text-admosa-dark/30">➔</span> Urbana</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}