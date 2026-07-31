import axios from "axios";

const render_url = import.meta.env.VITE_API_URL || "https://ian-4xua.onrender.com"

const apiDashboard = axios.create({
    baseURL: render_url,
    timeout: 75000
})

const apiAuth = axios.create({
    baseURL: `${render_url}/auth`,
    timeout: 75000
})

const apiUser = axios.create({
    baseURL: `${render_url}/user`,
    timeout: 75000
})


apiUser.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('token')
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)
export default apiUser

//Obtener todos los tableros
export const getAllDashboards = async() =>{
    try {
        const res = await apiDashboard.get('/getDashboards')
        return res.data
    } catch (error) {
        return {
            error: true,
            error
        }
    }
}


//Buscar un dashboard
export const getDashboardById = async(id)=>{
    try {
        const res = await apiDashboard.get(`/searchDashboards/${id}`)
        return res.data
    } catch (error) {
        return{
            error:true,
            message: error.message || 'Error al buscar el dashboard'
        }
    }
}

//Agregar dashboard
export const addDashboard = async(dashboard)=>{
    try {
        const res = await apiDashboard.post('/addDashboard', dashboard)
        return res.data
    } catch (error) {
        console.log("Error", error.response?.data)
        return{
            error: true,
            message: error.response?.data?.message || 'Error al agregar el tablero'
        }
    }
}


//Editar dashboard
export const updateDashboard = async(id, data) =>{
    try {
        const res = await apiDashboard.put(`/updateDashboard/${id}`, data)
        return res.data
    } catch (error) {
        return{
            error: true,
            message: error.response?.data?.message || 'Error al actualizar el tablero'
        }
    }
}


//Eleminar dashboard
export const deleteDashboard = async(id)=>{
    try {
        const res = await apiDashboard.delete(`/deleteDashboard/${id}`)
        return res.data
    } catch (error) {
        return{
            error: true,
            message: error.response?.data?.message || 'Error al borrar el tablero'
        }
    }
}


//Obtener recomendación según usuario
export const getRecommendations = async(prompt, chatHistory = []) => {
    try {
        // Añadimos chatHistory al cuerpo de la petición
        const res = await apiDashboard.post('/ianRecommendation', { 
            prompt, 
            chatHistory 
        });
        return res.data;
    } catch (error) {
        console.error("Axios falló al llamar a ianRecommendation: ", error);
        return {
            error: true,
            message: error.response?.data?.message || 'Error de conexión',
            error
        };
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



//Buscar sinonimo
export const getSynonymsById = async(id) =>{
    try {
        const res = await apiDashboard.get(`/searchSynonyms/${id}`)
        return res.data
    } catch (error) {
        return{
            error: true,
            message: error.response?.data?.message || 'Error al obtener un sinonimo'
        }
    }
}



//Agregar sinonimo
export const addSynonym = async(synonym)=>{
    try {
          const res = await apiDashboard.post(`/addSynonyms`, synonym)
          return res.data
    } catch (error) {
        return{
            error: true,
            message: error.response?.data?.message || 'Error al agregar un sinonimo'
        }
    }
}



//Actualizar sinonimo
export const updateSynonym = async(id, synonym)=>{
    try {
        const res = await apiDashboard.put(`/updateSynonyms/${id}`, synonym)
        return res.data
    } catch (error) {
        return{
            error: true,
            message: error.response?.data?.message || 'Error al actualizar un sinonimo'
        }
    }
}



//Eleminir sinonimo
export const deleteSynonym = async(id)=>{
    try {
        const res = await apiDashboard.delete(`/deleteSynonyms/${id}`)
        return res.data
    } catch (error) {
        return{
            error: true,
            message: error.response?.data?.message || 'Error al eliminar un sinonimo'
        }
    }
}


// obtener data cruda
export const getRawData = async()=>{
    try {
        const res = await apiDashboard.get('/rawdata')
        return res.data
    } catch (error) {
        return {
            error: true,
            error
        }
    }
}


// buscar data cruda
export const getRawDataById = async(id)=>{
    try {
        const res = await apiDashboard.get(`/searchRawData/${id}`)
        return res.data
    } catch (error) {
        return{
            error: true,
            message: error.response?.data?.message || 'Error al buscar información cruda'
        }
    }
}


// agregar data cruda
export const addRawData = async(payload)=>{
    try {
        const res = await apiDashboard.post('/addRawData', payload,{
            headers:{
                'Content-Type': 'application/json'
            }
        })
        return res.data
    } catch (error) {
        return{
            error: true,
            message: error.response?.data?.message || 'Error al agregar información cruda'
        }
    }
}


// actualizar data cruda
export const updateRawData = async(id, rawdata)=>{
    try {
        const res = await apiDashboard.put(`/updateRawData/${id}`, rawdata)
        return res.data
    } catch (error) {
        return{
            error: true,
            message: error.response?.data?.message || 'Error al actualizar información cruda'
        }
    }
}


// eliminar data cruda
export const deleteRawData = async(id)=>{
    try {
        const res = await apiDashboard.delete(`/deleteRawData/${id}`)
        return res.data
    } catch (error) {
        return{
            error: true,
            message: error.response?.data?.message || 'Error al eliminar información cruda'
        }
    }
}


//login
export const login = async(loginData)=>{
    try {
        const res = await apiAuth.post('/login', loginData)
        return res.data
    } catch (error) {
        return{
            error: true,
            message: error.response?.data?.message || 'Error al loggearse'
        }
    }
}


export const getAllUsers = async () => {
    try {
        const res = await apiUser.get('/getUsers');
        return res.data;
    } catch (error) {
        return {
            error: true,
            message: error.response?.data?.message || 'Error al obtener usuarios'
        };
    }
};

// OBTENER USUARIO POR ID
export const getUserProfile = async () => {
    try {
        const res = await apiUser.get(`/getUser`);
        return res.data
    } catch (error) {
        return {
            error: true,
            message: error.response?.data?.message || 'Error al obtener usuario'
        };
    }
};

// CREAR USUARIO
export const createUser = async (data) => {
    try {
        const res = await apiUser.post('/createUser', data);
        return res.data;
    } catch (error) {
        return {
            error: true,
            message: error.response?.data?.message || 'Error al crear usuario'
        };
    }
};

// ACTUALIZAR MI PERFIL
export const updateProfile = async (data) => {
    try {
        const res = await apiUser.put('/updateProfile', data);
        return res.data;
    } catch (error) {
        return {
            error: true,
            message: error.response?.data?.message || 'Error al actualizar perfil'
        };
    }
};

// ACTUALIZAR ROL (Solo FULL ADMIN)
export const updateUserAdmin = async (id, role) => {
    try {
        const res = await apiUser.put(`/adminUpdate/${id}`, { role });
        return res.data;
    } catch (error) {
        return {
            error: true,
            message: error.response?.data?.message || 'Error al actualizar el rol del usuario'
        };
    }
};


export const deleteUser = async(id)=>{
    try {
        const res = await apiUser.delete(`/deleteUser/${id}`)
        return res.data
    } catch (error) {
        return{
            error:true,
            message: error.response?.data?.message || 'Error al eliminar el usuario'
        }
    }
}
