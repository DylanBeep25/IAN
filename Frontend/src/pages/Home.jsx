import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BotMessageSquare, Bot, Send, Trash2, User, Info, ExternalLink, LayoutGrid, Folder } from 'lucide-react';
import { getRecommendations } from '../services/api.js';

export default function Home() {
  const navigate = useNavigate();
  
  // ==========================================
  // ESTADOS DEL CHATBOT
  // ==========================================
  const [query, setQuery] = useState('');

// ESTADO INICIAL CON PERSISTENCIA EN LOCALSTORAGE
  const [messages, setMessages] = useState(() => {
      // 1. Intentamos leer el historial guardado previamente
      const savedMessages = localStorage.getItem('ian_chat_history');
      if (savedMessages) {
          try {
              return JSON.parse(savedMessages);
          } catch (error) {
              console.error("Error al parsear el historial:", error);
          }
      }
      // 2. Si no hay nada guardado, usamos el mensaje de bienvenida por defecto
      return [
          {
              role: 'agent',
              text: '¡Hola! Soy el agente IAN. Estoy entrenado con los directorios, KPIs, sinónimos corporativos y preguntas frecuentes de todos los tableros. Dime qué tipo de información estás buscando.',
              recommendedTableros: []
          }
      ];
  });

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Guarda en localStorage automáticamente cada vez que cambia el estado 'messages'
  useEffect(() => {
      localStorage.setItem('ian_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleSetChatQuery = (text) => {
    setQuery(text);
    const inputEl = document.getElementById('chat-input');
    if (inputEl) inputEl.focus();
  };

  const handleClearChat = () => {
      const initialMessage = [
          {
              role: 'agent',
              text: '¡Historial de asesoría limpio! Escribe tu consulta o haz click en los atajos para comenzar de nuevo a buscar tu tablero ideal.',
              recommendedTableros: []
          }
      ];
      setMessages(initialMessage);
      localStorage.removeItem('ian_chat_history'); // Borra la persistencia en el navegador
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

      if (!result.error && result.message) {
        const formattedMessage = result.message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        setMessages(prev => [...prev, {
          role: 'agent',
          text: formattedMessage,
          recommendedTableros: result.data || []
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
    // CONTENEDOR PRINCIPAL: Altura calculada para no hacer scroll en la ventana entera
    <div className="max-w-7xl mx-auto w-full space-y-6 p-4 sm:p-6 text-admosa-dark">
      
      {/* ========================================== */}
      {/* HEADER: BIENVENIDA Y MÉTRICAS (EX HOME) */}
      {/* ========================================== */}
      <div className="bg-white rounded-2xl shadow-sm border border-admosa-dark/10 p-4 shrink-0 flex flex-col lg:flex-row justify-between items-center gap-4 relative overflow-hidden">
        {/* Efecto visual sutil */}
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-admosa-blue/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Bienvenida */}
        <div className="flex items-center gap-4 z-10 w-full lg:w-auto">
          <div className="p-3 bg-linear-to-br from-admosa-blue/10 to-admosa-purple/10 border border-admosa-blue/20 rounded-xl shadow-sm shrink-0">
            <BotMessageSquare className="w-8 h-8 text-admosa-blue drop-shadow-sm" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-admosa-dark tracking-tight leading-none">
              Bienvenido a IAN
            </h2>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-admosa-blue mt-1">
              Portal y Asesor de Inteligencia
            </p>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto hide-scrollbar pb-1 lg:pb-0 z-10">
          <div className="bg-admosa-gray/50 px-4 py-2 rounded-xl border border-admosa-dark/5 text-center shrink-0">
            <span className="text-[9px] font-bold text-admosa-dark/50 uppercase tracking-wider block">Región</span>
            <span className="text-sm font-bold text-admosa-dark flex items-center justify-center gap-1">🇬🇹 🇸🇻 🇭🇳</span>
          </div>
          <div className="bg-admosa-gray/50 px-4 py-2 rounded-xl border border-admosa-dark/5 text-center shrink-0">
            <span className="text-[9px] font-bold text-admosa-dark/50 uppercase tracking-wider block">Líneas</span>
            <span className="text-sm font-bold text-admosa-dark block">Motos y Autos</span>
          </div>
          <div className="bg-admosa-gray/50 px-4 py-2 rounded-xl border border-admosa-dark/5 text-center shrink-0">
            <span className="text-[9px] font-bold text-admosa-dark/50 uppercase tracking-wider block">Sincronización</span>
            <span className="text-[11px] font-bold text-[#00C988] mt-0.5 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C988] shadow-[0_0_4px_#00C988] animate-pulse"></span> Mongo DB
            </span>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* ÁREA PRINCIPAL: CHATBOT Y PANEL LATERAL */}
      {/* ========================================== */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row bg-white rounded-2xl shadow-sm border border-admosa-dark/10 overflow-hidden">
        
        {/* PANEL PRINCIPAL DE CHAT */}
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
          <div id="chat-messages" className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-admosa-gray/20">
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
                <div className={`p-4 rounded-2xl shadow-xs text-xs sm:text-sm leading-relaxed flex flex-col space-y-2 w-full ${
                  msg.role === 'user' 
                    ? 'bg-admosa-blue text-white rounded-tr-none' 
                    : 'bg-white text-admosa-dark border border-admosa-dark/10 rounded-tl-none'
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} className="wrap-break-word" />

                  {/* Grid dinámico de tableros recomendados */}
                  {msg.recommendedTableros && msg.recommendedTableros.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 w-full">
                      {msg.recommendedTableros.map((tab) => (
                        <div key={tab.codigo} className="bg-admosa-gray/30 border border-admosa-dark/5 p-3 rounded-xl shadow-xs flex flex-col justify-between space-y-2.5 text-left w-full overflow-hidden">
                          <div>
                            <div className="flex items-center justify-between text-[9px]">
                              <span className="font-extrabold text-admosa-dark/40">{tab.codigo}</span>
                              <span className="font-bold px-1.5 py-0.5 rounded-full bg-white text-admosa-blue border border-admosa-blue/10 uppercase tracking-wider">{tab.pais}</span>
                            </div>
                            <h4 className="font-bold text-admosa-dark text-xs mt-1 truncate" title={tab.nombre}>{tab.nombre}</h4>
                            <p className="text-[11px] text-admosa-dark/60 mt-0.5 line-clamp-2 leading-tight">{tab.descripcion}</p>
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-admosa-dark/5">
                            <button className="text-[10px] text-admosa-purple font-bold hover:underline flex items-center gap-0.5">
                              <Info className="w-3 h-3" />
                              <span>Detalles</span>
                            </button>
                            <a 
                              href={tab.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-[10px] bg-admosa-blue hover:bg-admosa-blue/90 text-white font-bold px-2 py-1 rounded-md flex items-center gap-1 transition-all"
                            >
                              <span>Acceder</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      ))}
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
                placeholder="Escribe tu consulta aquí..." 
                className="flex-1 px-4 py-2.5 text-sm bg-admosa-gray/50 border border-admosa-dark/10 rounded-xl focus:ring-2 focus:ring-admosa-blue focus:outline-none transition-all text-admosa-dark placeholder-admosa-dark/40"
                disabled={isTyping}
              />
              <button 
                type="submit" 
                disabled={isTyping || !query.trim()}
                className="bg-admosa-blue hover:bg-admosa-blue/90 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* ========================================== */}
        {/* PANEL LATERAL: NAVEGACIÓN Y ATAJOS */}
        {/* ========================================== */}
        <div className="w-full lg:w-80 p-4 bg-admosa-gray flex flex-col space-y-5 overflow-y-auto shrink-0 border-t lg:border-t-0 lg:border-l border-admosa-dark/10 order-2 max-h-[35%] lg:max-h-none">
          
          {/* ACCESOS RÁPIDOS (Mudados del Home Anterior) */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-admosa-dark/40">Navegación</h4>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => navigate('/tableros')} className="bg-white border border-admosa-dark/5 hover:border-admosa-purple/30 p-3 rounded-xl flex flex-col items-center justify-center gap-2 group transition-all shadow-sm">
                <LayoutGrid className="w-5 h-5 text-admosa-dark/40 group-hover:text-admosa-purple transition-colors" />
                <span className="text-[10px] font-bold text-admosa-dark group-hover:text-admosa-purple transition-colors">Tableros</span>
              </button>
              <button onClick={() => navigate('/rawdata')} className="bg-white border border-admosa-dark/5 hover:border-[#00C988]/30 p-3 rounded-xl flex flex-col items-center justify-center gap-2 group transition-all shadow-sm">
                <Folder className="w-5 h-5 text-admosa-dark/40 group-hover:text-[#00C988] transition-colors" />
                <span className="text-[10px] font-bold text-admosa-dark group-hover:text-[#00C988] transition-colors">Rutas</span>
              </button>
            </div>
          </div>

          <hr className="border-admosa-dark/5" />

          {/* ATAJOS DE PREGUNTAS */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-admosa-dark/40">Consultas Rápidas</h4>
            <div className="bg-white p-2.5 rounded-xl border border-admosa-dark/5 shadow-sm space-y-1 shrink-0">
              <button onClick={() => handleSetChatQuery('¿Cuál tablero muestra los precios de motocicletas en la región?')} className="w-full text-left text-xs text-admosa-dark/70 hover:text-admosa-blue hover:underline p-1.5 rounded-md hover:bg-admosa-blue/5 block truncate transition-colors">¿Precios de motocicletas?</button>
              <button onClick={() => handleSetChatQuery('¿Dónde puedo ver licitaciones vigentes en Guatemala?')} className="w-full text-left text-xs text-admosa-dark/70 hover:text-admosa-blue hover:underline p-1.5 rounded-md hover:bg-admosa-blue/5 block truncate transition-colors">¿Licitaciones vigentes?</button>
              <button onClick={() => handleSetChatQuery('¿Qué tablero analiza el mercado de autos nuevos en Guatemala?')} className="w-full text-left text-xs text-admosa-dark/70 hover:text-admosa-blue hover:underline p-1.5 rounded-md hover:bg-admosa-blue/5 block truncate transition-colors">¿Mercado de autos de agencia?</button>
              <button onClick={() => handleSetChatQuery('Necesito un tablero para monitorear precios de fuerza motriz')} className="w-full text-left text-xs text-admosa-dark/70 hover:text-admosa-blue hover:underline p-1.5 rounded-md hover:bg-admosa-blue/5 block truncate transition-colors">¿Precios fuerza motriz?</button>
            </div>
          </div>

          {/* SINÓNIMOS */}
          <div className="bg-linear-to-br from-admosa-purple/5 to-transparent p-3 rounded-xl border border-admosa-purple/10 space-y-2 shrink-0">
            <span className="text-xs font-bold text-admosa-purple block">Comprensión de Sinónimos</span>
            <p className="text-[11px] text-admosa-dark/60 leading-relaxed">IAN traduce automáticamente tus términos coloquiales a vocabulario técnico oficial:</p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-white p-1.5 rounded-lg text-[10px] border border-admosa-purple/10 text-admosa-dark/80 flex items-center justify-between"><strong className="text-admosa-purple font-black">Usado</strong> <span className="text-admosa-dark/30">➔</span> Rodado</div>
              <div className="bg-white p-1.5 rounded-lg text-[10px] border border-admosa-purple/10 text-admosa-dark/80 flex items-center justify-between"><strong className="text-admosa-purple font-black">Nuevo</strong> <span className="text-admosa-dark/30">➔</span> Agencia</div>
              <div className="bg-white p-1.5 rounded-lg text-[10px] border border-admosa-purple/10 text-admosa-dark/80 flex items-center justify-between"><strong className="text-admosa-purple font-black">Ventas</strong> <span className="text-admosa-dark/30">➔</span> Alzas</div>
              <div className="bg-white p-1.5 rounded-lg text-[10px] border border-admosa-purple/10 text-admosa-dark/80 flex items-center justify-between"><strong className="text-admosa-purple font-black">Sport</strong> <span className="text-admosa-dark/30">➔</span> Urbana</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}