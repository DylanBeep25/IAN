// utils/searchEngine.js

/**
 * Analiza un texto de entrada y devuelve los tableros o rawdata con mayor puntuación
 * basándose en tokens y en el diccionario de sinónimos dinámico.
 */
export function getLocalRecommendations(prompt, dbTableros, dbSinonimos, dbRawData = []) {
  let query = prompt.toLowerCase();

  // Aplicar diccionario de sinónimos dinámico
  dbSinonimos.forEach(sin => {
    if (query.includes(sin.termino.toLowerCase())) {
      query += " " + sin.significado.toLowerCase();
    }
  });

  const tokens = query.split(/\s+/).filter(t => t.length > 0);
  if (tokens.length === 0) return [];

  // 1. Evaluar Tableros
  const scoredTableros = dbTableros.map(tab => {
    let score = 0;
    tokens.forEach(token => {
      if (tab.nombre.toLowerCase().includes(token)) score += 20;
      if (tab.codigo.toLowerCase().includes(token)) score += 25;
      if (tab.pais.toLowerCase().includes(token)) score += 15;
      if (tab.descripcion.toLowerCase().includes(token)) score += 8;
      if (tab.keywords && tab.keywords.some(k => k.toLowerCase().includes(token))) score += 5;
      if (tab.preguntas && tab.preguntas.some(p => p.toLowerCase().includes(token))) score += 4;
      if (tab.kpis && tab.kpis.some(k => k.name && k.name.toLowerCase().includes(token))) score += 6;
    });
    return { item: tab, type: 'dashboard', score };
  });

  // 2. Evaluar RawData (Carpetas, Mapas, etc.)
  const scoredRawData = dbRawData.map(raw => {
    let score = 0;
    tokens.forEach(token => {
      if (raw.nombreCarpeta && raw.nombreCarpeta.toLowerCase().includes(token)) score += 25;
      if (raw.descripcion && raw.descripcion.toLowerCase().includes(token)) score += 12;
      if (raw.resumenIA && raw.resumenIA.toLowerCase().includes(token)) score += 15;
    });
    return { item: raw, type: 'rawdata', score };
  });

  // Combinar ambos resultados
  const todosLosPuntajes = [...scoredTableros, ...scoredRawData];

  const resultadoOrdenado = todosLosPuntajes
    .filter(entry => entry.score > 0)
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