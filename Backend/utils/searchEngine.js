// utils/searchEngine.js

/**
 * Analiza un historial de entrada y devuelve los tableros o rawdata con mayor puntuación
 * basándose en tokens, historial ponderado y sinónimos dinámicos.
 */
export function getLocalRecommendations(chatHistory, dbTableros, dbSinonimos, dbRawData = []) {
  // chatHistory debe ser un arreglo de strings con los últimos mensajes del usuario
  // Ejemplo: ["Necesito realizar un analisis del parque vehicular de Guate", "y existe alguna BDD?"]
  
  if (!chatHistory || chatHistory.length === 0) return [];

  // Mapa para guardar cada token y su multiplicador de peso más alto
  const tokenWeights = new Map();

  // Procesamos de más antiguo a más reciente
  chatHistory.forEach((mensaje, index) => {
    let query = mensaje.toLowerCase();

    // Aplicar diccionario de sinónimos dinámico
    dbSinonimos.forEach(sin => {
      if (query.includes(sin.termino.toLowerCase())) {
        query += " " + sin.significado.toLowerCase();
      }
    });

    const tokens = query.split(/\s+/).filter(t => t.length > 0);
    
    // Calcular el multiplicador: el mensaje más reciente vale 1.0, el anterior 0.6, etc.
    const distanceToLast = (chatHistory.length - 1) - index;
    const weightMultiplier = Math.pow(0.6, distanceToLast); 

    tokens.forEach(token => {
      // Si el token ya existe (se repite la palabra), conservamos el peso más alto
      const currentWeight = tokenWeights.get(token) || 0;
      tokenWeights.set(token, Math.max(currentWeight, weightMultiplier));
    });
  });

  if (tokenWeights.size === 0) return [];

  // 1. Evaluar Tableros
  const scoredTableros = dbTableros.map(tab => {
    let score = 0;
    
    tokenWeights.forEach((multiplier, token) => {
      if (tab.nombre.toLowerCase().includes(token)) score += (20 * multiplier);
      if (tab.codigo.toLowerCase().includes(token)) score += (25 * multiplier);
      if (tab.pais.toLowerCase().includes(token)) score += (15 * multiplier);
      if (tab.descripcion.toLowerCase().includes(token)) score += (8 * multiplier);
      if (tab.keywords && tab.keywords.some(k => k.toLowerCase().includes(token))) score += (5 * multiplier);
      if (tab.preguntas && tab.preguntas.some(p => p.toLowerCase().includes(token))) score += (4 * multiplier);
      if (tab.kpis && tab.kpis.some(k => k.name && k.name.toLowerCase().includes(token))) score += (6 * multiplier);
    });
    
    return { item: tab, type: 'dashboard', score };
  });

  // 2. Evaluar RawData (Carpetas, Mapas, etc.)
  const scoredRawData = dbRawData.map(raw => {
    let score = 0;
    
    tokenWeights.forEach((multiplier, token) => {
      if (raw.nombreCarpeta && raw.nombreCarpeta.toLowerCase().includes(token)) score += (25 * multiplier);
      if (raw.descripcion && raw.descripcion.toLowerCase().includes(token)) score += (12 * multiplier);
      if (raw.resumenIA && raw.resumenIA.toLowerCase().includes(token)) score += (15 * multiplier);
    });
    
    return { item: raw, type: 'rawdata', score };
  });

  // Combinar ambos resultados
  const todosLosPuntajes = [...scoredTableros, ...scoredRawData];

  const resultadoOrdenado = todosLosPuntajes
    .filter(entry => entry.score > 10) // Subimos un poco el umbral mínimo para evitar basura
    .sort((a, b) => b.score - a.score);

  if (resultadoOrdenado.length === 0) return [];
  if (resultadoOrdenado.length === 1) return [resultadoOrdenado[0].item];

  const scorePrimero = resultadoOrdenado[0].score;
  const scoreSegundo = resultadoOrdenado[1].score;
  const diferenciaDiferencial = scorePrimero - scoreSegundo;

  if (diferenciaDiferencial === 0 || diferenciaDiferencial < 15) {
    return [resultadoOrdenado[0].item, resultadoOrdenado[1].item];
  }

  if (scorePrimero >= scoreSegundo * 1.5) {
    return [resultadoOrdenado[0].item];
  }

  return [resultadoOrdenado[0].item, resultadoOrdenado[1].item];
}
