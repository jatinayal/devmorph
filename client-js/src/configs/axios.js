import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASEURL || 'https://devmorphs.onrender.com',
    withCredentials: true
})

export default api
