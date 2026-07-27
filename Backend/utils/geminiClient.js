// utils/geminiClient.js

async function fetchWithRetry(url, options, retries = 2, delay = 2000) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorDetalle = await response.json();
      console.error("MOTIVO REAL DEL RECHAZO DE GOOGLE:", JSON.stringify(errorDetalle, null, 2));
      throw new Error(`HTTP status ${response.status}`);
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Reintentando conexión con Gemini... Quedan ${retries} intentos.`);
      await new Promise(res => setTimeout(res, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function consultarGeminiEnServidor(prompt, dbTableros, dbSinonimos, dbRawData) {

  const apiKey = process.env.GEMINI_API_KEY; 
  console.log("API key: ", apiKey ? "Si existe": "Viene vacía")

  if (!apiKey) throw new Error("La variable GEMINI_API_KEY no está configurada en el .env");


  const systemInstruction = `
    Eres el "Asesor Inteligente de Tableros y Datos (IAN-Agent)", un asistente experto diseñado para guiar a los usuarios a encontrar el tablero de interés, mapas, o directorio analítico ideal según sus necesidades de negocio.
    
    Tienes acceso a dos bases de conocimiento de la empresa:
    1. DIRECTORIO DE TABLEROS COMERCIALES:
    ${JSON.stringify(dbTableros, null, 2)}

    2. DIRECTORIO DE DATOS CRUDOS Y MAPAS (RAW DATA):
    ${JSON.stringify(dbRawData, null, 2)}
    
    También cuentas con este glosario de sinónimos para entender su lenguaje coloquial:
    ${JSON.stringify(dbSinonimos, null, 2)}
    
    REGLAS CRÍTICAS DE RESPUESTA Y FORMATO:
    1. PROHIBIDO INCLUIR ENLACES DIRECTOS O URLS: No agregues links de SharePoint ni texto de hipervínculos. La interfaz ya renderiza tarjetas interactivas para eso.
    2. PROHIBIDO USAR VIÑETAS O ASTERISCOS (* o •): Redacta tus respuestas en párrafos limpios y corridos. No uses listas con viñetas.
    3. RESPUESTAS ULTRA-RESUMIDAS: Sé breve. Da un comentario introductorio muy corto y describe puntualmente el tablero o carpeta/mapa de datos que estás recomendando.
    4. CONTROL DE TEMAS INEXISTENTES O FUERA DE CONTEXTO:
       - Si te piden información que NO EXISTE en el directorio de tableros ni en el de datos, indica explícitamente que no posees ese recurso, pero recomienda la alternativa más cercana que sí exista.
       - Si el usuario dice palabras al azar o temas ajenos al negocio (ej. "cama", "videojuegos", "fútbol"), responde EXACTAMENTE con este mensaje: "Como tu asistente estoy preparado para indicarte tableros y archivos de datos, perdona si no tengo una respuesta para eso." y NO menciones ningún recurso.
    5. Nunca compartas códigos internos de sistema (ej. MKT001) ni las rutas completas de los archivos JSON.
  `;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ 
        parts: [{ text: prompt }] 
      }],
      systemInstruction: { 
        parts: [{ text: systemInstruction }] 
      }
    })
  });

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No logré estructurar una sugerencia en este momento. Intenta de nuevo.";
}