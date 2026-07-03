import { parsearCSVCompleto } from "../../utils/csvParser.js";


/**
 * Descarga y procesa el CSV de Sinónimos desde Google Sheets.
 * @export
*/
export const getSynonyms = async(req, res) =>{
    const URL_CSV_SINONIMOS = process.env.URL_CSV_SINONIMOS;
    try {
        const response = await fetch(URL_CSV_SINONIMOS);
        const dataText = await response.text();
        
        const todasLasFilas = parsearCSVCompleto(dataText);
        const sinonimos = [];
        
        for (let i = 1; i < todasLasFilas.length; i++) {
          const valores = todasLasFilas[i];
          if (valores.length < 2) continue;
          
          sinonimos.push({
            termino: valores[0].trim(),
            significado: valores[1].trim()
          });
        }
        
        return res.status(200).json({
            message: "Sinónimos obtenidos exitosamente",
            data: sinonimos
        })

    } catch (error) {
        console.error("Error al obtener cuadro de sinónimos: ", error)
        return res.status(500).json({message: "Error interno del servidor al procesar sinónimos"})
    }
}