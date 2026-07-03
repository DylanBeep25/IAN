//Chatbot IA
// src/Pages/AgentIAN.jsx
import React, { useState, useRef, useEffect } from 'react';
import { BotMessageSquare, Bot, Send, Trash2, User, Info, ExternalLink } from 'lucide-react';
import { getRecommendations } from '../Services/api.js';

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

  // Efecto para hacer auto-scroll siempre que haya un mensaje nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSetChatQuery = (text) => {
    setQuery(text);
    document.getElementById('chat-input').focus();
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
    
    // 1. Agregar mensaje del usuario
    setMessages(prev => [...prev, { role: 'user', text: userPrompt }]);
    setIsTyping(true);

    try {
      // 2. Llamar al backend
      const result = await getRecommendations(userPrompt);

      // 3. Procesar y agregar respuesta del agente
      if (!result.error && result.message) {
        // Convertimos el Markdown de negritas (**texto**) a strong HTML
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
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-full min-h-[calc(100vh-73px)]">
      
      {/* PANEL PRINCIPAL DE CHAT */}
      <div className="flex-1 flex flex-col bg-white border-b md:border-b-0 md:border-r border-slate-200 overflow-hidden h-full">
        
        {/* Header del Chat */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
              <BotMessageSquare className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">IAN-Agent</h3>
              <p className="text-[11px] text-accent-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
                Asesor de Directorios Activo
              </p>
            </div>
          </div>
          <button onClick={handleClearChat} className="text-xs text-slate-400 hover:text-slate-600 flex items-center space-x-1 p-1 rounded hover:bg-slate-100 transition-all">
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Limpiar Historial</span>
          </button>
        </div>

        {/* Historial de Mensajes */}
        <div id="chat-messages" className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
          
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start space-x-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}>
              
              {/* Icono del usuario o agente */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-brand-100 text-brand-600 border-brand-200' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Burbuja de mensaje */}
              <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed flex flex-col space-y-2 ${msg.role === 'user' ? 'bg-brand-600 text-white' : 'bg-indigo-50/50 text-slate-800 border border-indigo-100/30 w-full'}`}>
                
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />

                {/* Grid dinámico de tableros recomendados (si aplica) */}
                {msg.recommendedTableros && msg.recommendedTableros.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {msg.recommendedTableros.map((tab) => (
                      <div key={tab.codigo} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between space-y-3 text-left">
                        <div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-extrabold text-slate-400">{tab.codigo}</span>
                            <span className="font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{tab.pais}</span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-xs mt-1.5">{tab.nombre}</h4>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-normal">{tab.descripcion}</p>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                          {/* El botón de detalles podrías conectarlo luego al Modal */}
                          <button className="text-[11px] text-brand-600 font-bold hover:underline flex items-center gap-0.5">
                            <Info className="w-3.5 h-3.5" />
                            <span>Detalles</span>
                          </button>
                          <a href={tab.url} target="_blank" rel="noreferrer" className="text-[11px] bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold px-2 py-1 rounded border border-brand-200 flex items-center gap-1 transition-all">
                            <span>Acceder</span>
                            <ExternalLink className="w-3 h-3" />
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

        {/* Indicador de escritura (Oculto por defecto) */}
        {isTyping && (
          <div className="px-4 py-2 flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            <span>IAN está analizando tu solicitud...</span>
          </div>
        )}

        {/* Input Form */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input 
              type="text" 
              id="chat-input" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribe tu consulta en lenguaje natural (ej. 'Quiero ver cuotas de mercado de motos')..." 
              className="flex-1 px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all text-slate-800"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={isTyping || !query.trim()}
              className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl transition-all shadow-md flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* PANEL LATERAL DE ATAJOS */}
      <div className="w-full md:w-80 p-4 bg-slate-50 flex flex-col space-y-4 overflow-y-auto custom-scrollbar">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Atajos del Asesor</h4>
        
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-700 block">Consultas Rápidas</span>
          <div className="space-y-1">
            <button onClick={() => handleSetChatQuery('¿Cuál tablero muestra los precios de motocicletas en la región?')} className="w-full text-left text-xs text-slate-600 hover:text-indigo-600 hover:underline p-1 block truncate">¿Precios de motocicletas?</button>
            <button onClick={() => handleSetChatQuery('¿Dónde puedo ver licitaciones vigentes en Guatemala?')} className="w-full text-left text-xs text-slate-600 hover:text-indigo-600 hover:underline p-1 block truncate">¿Licitaciones vigentes?</button>
            <button onClick={() => handleSetChatQuery('¿Qué tablero analiza el mercado de autos nuevos en Guatemala?')} className="w-full text-left text-xs text-slate-600 hover:text-indigo-600 hover:underline p-1 block truncate">¿Mercado de autos de agencia?</button>
            <button onClick={() => handleSetChatQuery('Necesito un tablero para monitorear precios de fuerza motriz')} className="w-full text-left text-xs text-slate-600 hover:text-indigo-600 hover:underline p-1 block truncate">¿Precios fuerza motriz?</button>
          </div>
        </div>

        <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 space-y-2">
          <span className="text-xs font-semibold text-indigo-800 block">Comprensión de Sinónimos</span>
          <p className="text-[11px] text-slate-600 leading-normal">El IAN-Agent traduce automáticamente tus términos a vocabulario técnico oficial de la organización:</p>
          <div className="grid grid-cols-2 gap-1 pt-1">
            <div className="bg-white p-1.5 rounded text-[10px] border border-indigo-50"><strong className="text-indigo-700">Usado</strong> ➔ Rodado</div>
            <div className="bg-white p-1.5 rounded text-[10px] border border-indigo-50"><strong className="text-indigo-700">Nuevo</strong> ➔ Agencia</div>
            <div className="bg-white p-1.5 rounded text-[10px] border border-indigo-50"><strong className="text-indigo-700">Ventas</strong> ➔ Alzas</div>
            <div className="bg-white p-1.5 rounded text-[10px] border border-indigo-50"><strong className="text-indigo-700">Sport</strong> ➔ Urbana</div>
          </div>
        </div>
      </div>
    </div>
  );
}