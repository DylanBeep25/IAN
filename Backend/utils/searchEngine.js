// utils/searchEngine.js

/**
 * Analiza el historial/prompt de entrada y devuelve los tableros o rawdata con mayor puntuación
 * basándose en tokens con peso histórico, bonificación de país e intención de RawData.
 */
export function getLocalRecommendations(chatHistory, dbTableros, dbSinonimos, dbRawData = []) {
  // Aseguramos que chatHistory sea un array (soporta string directo o array de mensajes)
  const historyArray = Array.isArray(chatHistory) ? chatHistory : [chatHistory];
  if (!historyArray || historyArray.length === 0) return [];

  // 1. Construcción de TokenWeights con decaimiento histórico
  const tokenWeights = new Map();
  let fullContextText = "";

  historyArray.forEach((mensaje, index) => {
    if (!mensaje) return;
    let query = mensaje.toLowerCase();
    fullContextText += " " + query;

    // Aplicar sinónimos
    dbSinonimos.forEach(sin => {
      if (query.includes(sin.termino.toLowerCase())) {
        query += " " + sin.significado.toLowerCase();
      }
    });

    const tokens = query.split(/\s+/).filter(t => t.length > 2); // Ignoramos conectores cortos (y, de, en)
    
    // Multiplicador histórico: mensaje actual = 1.0, anterior = 0.6, etc.
    const distanceToLast = (historyArray.length - 1) - index;
    const weightMultiplier = Math.pow(0.6, distanceToLast); 

    tokens.forEach(token => {
      const currentWeight = tokenWeights.get(token) || 0;
      tokenWeights.set(token, Math.max(currentWeight, weightMultiplier));
    });
  });

  if (tokenWeights.size === 0) return [];

  // Detectar si el usuario busca explícitamente bases de datos o data cruda
  const rawDataKeywords = ['bdd', 'db', 'base', 'raw', 'cruda', 'carpeta', 'excel', 'csv', 'rawdata', 'datos', 'archivo','bd', 'presentacion', 'presentación'];
  const tieneIntencionRawData = rawDataKeywords.some(kw => fullContextText.includes(kw));

  // 2. Evaluar Tableros
  const scoredTableros = dbTableros.map(tab => {
    let score = 0;
    const tabNombre = (tab.nombre || '').toLowerCase();
    const tabPais = (tab.pais || '').toLowerCase();
    const tabCodigo = (tab.codigo || '').toLowerCase();

    tokenWeights.forEach((multiplier, token) => {
      // Coincidencia en Nombre (Puntaje alto)
      if (tabNombre.includes(token)) score += (35 * multiplier);
      if (tabCodigo.includes(token)) score += (30 * multiplier);
      
      // 🎯 PAÍS ES UN FILTRO CRÍTICO: Si coincide el país, damos un súper boost
      if (tabPais && tabPais.includes(token)) {
        score += (60 * multiplier); 
      }
      
      if (tab.descripcion && tab.descripcion.toLowerCase().includes(token)) score += (8 * multiplier);
      if (tab.keywords && tab.keywords.some(k => k.toLowerCase().includes(token))) score += (10 * multiplier);
      if (tab.preguntas && tab.preguntas.some(p => p.toLowerCase().includes(token))) score += (5 * multiplier);
      if (tab.kpis && tab.kpis.some(k => k.name && k.name.toLowerCase().includes(token))) score += (6 * multiplier);
    });

    // 🎯 Bonificación por frase / coincidencia relevante en el título
    if (fullContextText.includes(tabNombre) && tabNombre.length > 3) {
      score += 80; 
    }

    return { item: tab, type: 'dashboard', score };
  });

  // 3. Evaluar RawData (Carpetas, Mapas, etc.)
  const scoredRawData = dbRawData.map(raw => {
    let score = 0;
    const rawNombre = (raw.nombreCarpeta || '').toLowerCase();

    tokenWeights.forEach((multiplier, token) => {
      if (rawNombre.includes(token)) score += (40 * multiplier);
      if (raw.descripcion && raw.descripcion.toLowerCase().includes(token)) score += (15 * multiplier);
      if (raw.resumenIA && raw.resumenIA.toLowerCase().includes(token)) score += (20 * multiplier);
    });

    // 🚀 BOOST SI HAY INTENCIÓN DE BDD/DATA CRUDA
    if (tieneIntencionRawData && score > 0) {
      score *= 2.2; // Multiplica por 2.2 la prioridad de RawData si menciona palabras clave
    }

    return { item: raw, type: 'rawdata', score };
  });

  // 4. Filtrar y Ordenar Resultados
  const todosLosPuntajes = [...scoredTableros, ...scoredRawData]
    .filter(entry => entry.score > 15) // Umbral mínimo para descartar basura
    .sort((a, b) => b.score - a.score);

  if (todosLosPuntajes.length === 0) return [];

  const primero = todosLosPuntajes[0];

  // Si solo hay un resultado aceptable, lo retornamos directo
  if (todosLosPuntajes.length === 1) return [primero.item];

  const segundo = todosLosPuntajes[1];
  const diferencia = primero.score - segundo.score;

  // 🎯 REGLAS STRICTAS DE DEVOLUCIÓN:
  
  // Regla A: Si el primer lugar le saca más de 25 puntos de ventaja al segundo, ES UN GANADOR CLARO.
  // (Esto arregla el problema de AUP Guatemala vs AUP Honduras).
  if (diferencia >= 25) {
    return [primero.item];
  }

  // Regla B: Si el primero duplica o supera por 1.4x al segundo, dar solo 1 recomendación.
  if (primero.score >= segundo.score * 1.4) {
    return [primero.item];
  }

  // Regla C: Si los puntajes están muy parejos (ej. Tablero y RawData de la misma categoría),
  // enviamos ambos para darle variedad al usuario.
  return [primero.item, segundo.item];
}