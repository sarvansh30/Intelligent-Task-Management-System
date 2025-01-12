import axios from 'axios';

const API_URL = "http://localhost:8000";

export const api = axios.create({
    baseURL: API_URL,
});

export const getTDS = async () => {
    try {
        const response = await api.get('/todos'); // Corrected variable name
        return response.data;
    } catch (error) {
        console.error("Error fetching todos:", error);
        throw error; // Rethrow error for proper handling by caller
    }
};

export const postTDS =async (newTodo)=>{
    try {
        const reponse=await api.post('/addTDS',null,{
            params:{todo:newTodo}});
        getTDS();
        return reponse.data
    } catch (error) {
        console.log(error);
    }
}
