/**
 * Lector de CSV robusto: Soporta saltos de línea y comas dentro de celdas con comillas
 * @param {string} text - El texto plano del CSV proveniente de Google Sheets
 * @returns {Array[]} Matriz de filas y celdas
 */


export function parsearCSVCompleto(text) {
  let lineas = [];
  let fila = [""];
  let dentroDeComillas = false;

  for (let i = 0; i < text.length; i++) {
    let c = text[i];
    let proximo = text[i + 1];

    if (c === '"') {
      if (dentroDeComillas && proximo === '"') { 
        fila[fila.length - 1] += '"'; i++; 
      } else { 
        dentroDeComillas = !dentroDeComillas; 
      }
    } else if (c === ',' && !dentroDeComillas) {
      fila.push('');
    } else if ((c === '\r' || c === '\n') && !dentroDeComillas) {
      if (c === '\r' && proximo === '\n') { i++; }
      lineas.push(fila);
      fila = [''];
    } else {
      fila[fila.length - 1] += c;
    }
  }
  if (fila.length > 1 || fila[0] !== '') { lineas.push(fila); }
  return lineas;
}