import axios from "axios";

const apiDashboard = axios.create({
    baseURL: 'http://localhost:3200',
    timeout: 30000
})


//Obtener todos los tableros
export const getAllDashboards = async() =>{
    try {
        const res = await apiDashboard.get('/dashboards')
        return res.data
    } catch (error) {
        return {
            error: true,
            error
        }
    }
}


//Obtener todos los sinonimos
export const getAllSynonyms = async() =>{
    try {
        const res = await apiDashboard.get('/synonyms')
        return res.data
    } catch (error) {
        return {
            error: true,
            error
        }
    }
}

//Obtener recomendación según usuario
export const getRecommendations = async(prompt)=>{
    try {
        const res = await apiDashboard.post('/recommend', {prompt})
        return res.data
    } catch (error) {
        return {
            error: true,
            error
        }
    }
}