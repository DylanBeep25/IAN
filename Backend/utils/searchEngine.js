// utils/searchEngine.js

/**
 * Analiza un texto de entrada y devuelve los tableros con mayor puntuación
 * basándose en tokens y en el diccionario de sinónimos dinámico.
 */
export function getLocalRecommendations(prompt, dbTableros, dbSinonimos) {
  let query = prompt.toLowerCase();

  // Aplicar diccionario de sinónimos dinámico
  dbSinonimos.forEach(sin => {
    if (query.includes(sin.termino.toLowerCase())) {
      query += " " + sin.significado.toLowerCase();
    }
  });

  const tokens = query.split(/\s+/).filter(t => t.length > 0);
  if (tokens.length === 0) return [];

  const scored = dbTableros.map(tab => {
    let score = 0;

    // Sistema de puntaje por relevancia
    tokens.forEach(token => {
      if (tab.nombre.toLowerCase().includes(token)) score += 20;
      if (tab.codigo.toLowerCase().includes(token)) score += 25;
      if (tab.pais.toLowerCase().includes(token)) score += 15;
      if (tab.descripcion.toLowerCase().includes(token)) score += 8;
      if (tab.keywords.some(k => k.toLowerCase().includes(token))) score += 5;
      if (tab.preguntas.some(p => p.toLowerCase().includes(token))) score += 4;
      // Validamos que exista kpis y name antes de evaluar
      if (tab.kpis && tab.kpis.some(k => k.name && k.name.toLowerCase().includes(token))) score += 6;
    });

    return { tab, score };
  });

  const resultadoOrdenado = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (resultadoOrdenado.length === 0) return [];
  if (resultadoOrdenado.length === 1) return [resultadoOrdenado[0].tab];

  const scorePrimero = resultadoOrdenado[0].score;
  const scoreSegundo = resultadoOrdenado[1].score;
  const diferenciaDiferencial = scorePrimero - scoreSegundo;

  if (diferenciaDiferencial === 0 || diferenciaDiferencial < 15) {
    return [resultadoOrdenado[0].tab, resultadoOrdenado[1].tab];
  }

  if (scorePrimero >= scoreSegundo * 1.5) {
    return [resultadoOrdenado[0].tab];
  }

  return [resultadoOrdenado[0].tab, resultadoOrdenado[1].tab];
}