// utils/contextBuilder.js

export function buildLightweightCatalog(dbTableros, dbRawData) {
    // Solo enviamos lo que la IA necesita para tomar la decisión
    const catalog = [];

    dbTableros.forEach(tab => {
        catalog.push({
            id_referencia: tab.codigo || tab._id.toString(), // ID ÚNICO
            tipo: "dashboard",
            nombre: tab.nombre,
            pais: tab.pais || "Global",
            descripcion_corta: tab.descripcion?.substring(0, 150) || "",
            keywords: tab.keywords || []
        });
    });

    dbRawData.forEach(raw => {
        catalog.push({
            id_referencia: raw._id.toString(), // ID ÚNICO
            tipo: "raw_data", // Carpeta, BDD, etc.
            nombre: raw.nombreCarpeta,
            descripcion_corta: raw.resumenIA || raw.descripcion?.substring(0, 150) || ""
        });
    });

    return catalog;
}

export function formatChatHistoryForGemini(chatHistory) {
    if (!Array.isArray(chatHistory) || chatHistory.length === 0) return [];
    
    // Mapear el historial del frontend al formato exacto de Gemini
    // Asumiendo que el frontend manda: [{ role: 'user', content: '...' }, { role: 'model', content: '...' }]
    return chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content || msg.text || "" }]
    }));
}
