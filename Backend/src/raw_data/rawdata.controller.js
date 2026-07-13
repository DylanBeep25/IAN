import { parsearCSVCompleto } from "../../utils/csvParser.js";

/**
 * Descarga y procesa el CSV de Raw Data (Carpetas de datos crudos) desde Google Sheets.
 * @export
*/
export const getRowData = async(req, res) => {
    // 💡 IMPORTANTE: Recuerda agregar URL_CSV_ROW_DATA a tu archivo .env
    const URL_CSV_ROW_DATA = process.env.URL_CSV_ROW_DATA;
    
    try {
        const response = await fetch(URL_CSV_ROW_DATA);
        const dataText = await response.text();
        
        const todasLasFilas = parsearCSVCompleto(dataText);
        const rowDataLinks = [];
        
        // Empezamos el bucle en 1 para omitir la fila de encabezados (Nombre, Tablero, Link)
        for (let i = 1; i < todasLasFilas.length; i++) {
          const valores = todasLasFilas[i];
          
          // Verificamos que la fila tenga al menos 3 columnas para evitar errores con filas vacías
          if (valores.length < 3) continue;
          
          rowDataLinks.push({
            nombre: valores[0].trim(),
            tablero: valores[1].trim(),
            link: valores[2].trim()
          });
        }
        
        return res.status(200).json({
            message: "Enlaces de raw data obtenidos exitosamente",
            data: rowDataLinks
        });

    } catch (error) {
        console.error("Error al obtener cuadro de raw data: ", error);
        return res.status(500).json({message: "Error interno del servidor al procesar raw data"});
    }
}