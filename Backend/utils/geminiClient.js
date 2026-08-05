// utils/geminiClient.js

async function fetchWithRetry(url, options, retries = 2, delay = 2000) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorDetalle = await response.json();
      console.error("ERROR DE GOOGLE:", JSON.stringify(errorDetalle, null, 2));
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

export async function consultarGeminiEnServidor(prompt, historialFormateado, catalogoLigero, dbSinonimos) {
  const apiKey = process.env.GEMINI_API_KEY; 
  if (!apiKey) throw new Error("La variable GEMINI_API_KEY no está configurada en el .env");

  const systemInstruction = `
Eres el "Asesor Inteligente de Tableros y Datos (IAN-Agent)". Tu trabajo es entender la intención del usuario y seleccionar el recurso EXACTO del catálogo proporcionado.

CATÁLOGO DISPONIBLE (Únicos recursos que puedes recomendar):
${JSON.stringify(catalogoLigero)}

GLOSARIO DE SINÓNIMOS:
${JSON.stringify(dbSinonimos)}

REGLAS DE DECISIÓN CRÍTICAS:
1. Debes analizar el historial para entender el contexto (ej. si el usuario dice "¿y dónde está?", se refiere al recurso mencionado en el turno anterior).
2. Distingue entre 'dashboard' y 'raw_data'. Si piden un tablero, recomienda el dashboard.
3. Respeta el país. Si piden Guatemala, no des Honduras a menos que sea regional.
4. Si el usuario pide un número exacto de recomendaciones (ej. "solo 1"), en el array 'ids_seleccionados' debe ir exactamente esa cantidad.
5. NO INVENTES IDs. Usa estrictamente los 'id_referencia' del catálogo.

REGLAS DE REDACCIÓN DE RESPUESTA:
1. NUNCA uses enlaces, URLs ni viñetas (* o •). Redacta en un solo párrafo corrido.
2. Sé muy breve.
3. Si la charla no tiene relación con el negocio (ej. "¿cuántas camas tiene un hospital?", "fútbol"), deja el array de IDs vacío y responde: "Como tu asistente estoy preparado para indicarte tableros y archivos de datos, perdona si no tengo una respuesta para eso."
4. Si la información no existe, dilo claramente. NUNCA inventes recursos.
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  // Preparamos el historial + el mensaje actual
  const contents = [...historialFormateado, { role: "user", parts: [{ text: prompt }] }];

  const response = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: contents,
      systemInstruction: { 
        parts: [{ text: systemInstruction }] 
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            analisis_interno: {
              type: "STRING",
              description: "Breve razonamiento interno sobre el historial, cambio de tema, país e intención del usuario. No se mostrará al usuario."
            },
            ids_seleccionados: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "Lista de los 'id_referencia' seleccionados del catálogo. Vacío si no hay coincidencias o si el tema está fuera de contexto."
            },
            respuesta_agente: {
              type: "STRING",
              description: "La respuesta amigable y breve que se mostrará al usuario, cumpliendo todas las reglas de redacción."
            }
          },
          required: ["analisis_interno", "ids_seleccionados", "respuesta_agente"]
        }
      }
    })
  });

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!rawText) throw new Error("Respuesta vacía de Gemini");

  try {
    return JSON.parse(rawText);
  } catch (e) {
    console.error("Error parseando el JSON de Gemini:", rawText);
    throw new Error("Gemini no devolvió un JSON válido");
  }
}
