import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASEURL || 'https://devmorph-server.onrender.com',
    withCredentials: true
})

export default api
