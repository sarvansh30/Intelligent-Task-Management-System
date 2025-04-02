import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;

        }
        return config;
    },
    (error)=>{
        Promise.reject(error);
    }
);

export default api;

