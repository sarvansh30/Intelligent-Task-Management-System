import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
    baseURL: API_URL,
});


export const UserSignUp = async (username,password)=>{
    try{
        const response = await api.post('/userSignUp',{
            "username":username,
            "password": password
        });
        return response;
    }catch(error){
        console.log("Error",error);
        throw error;
    }
};


export const checkLogin = async (username,password)=>{
    try{
        const response =await api.post('/checkLogin',{
                "username":username,
                "password":password
        });
        return response.data;
    }
    catch(error){
        console.log("Error:",error);
        throw error;
    }
};


export const getTDS = async () => {
    try {
        const response = await api.get('/todos'); 
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching todos:", error);
        throw error; 
    }
};

export const postTDS =async (newTodo)=>{
    try {
        const reponse=await api.post('/addTDS',newTodo);
        // getTDS();
        return reponse.data
    } catch (error) {
        console.log(error);
    }
};

export const deleteTD=async (todoID)=>{
    try {
        const response= await api.delete('/deleteTD',{
            params: {_id:todoID}
        }) ;
        return response.data
    } catch (error) {
        console.log(error);
    }
};

export const UpdateTD= async (todoID,iscompleted)=>{
    const reponse =await api.put('/updateTD/',null,{
        params:{_id:todoID,
            iscompleted:iscompleted
        }
    });
    return reponse.data;
};

export const PrioritiseHelperAi = async ()=>{
    try{
  await api.get('/helper-ai-priority'); }
  catch(error){
    console.log(error);
  }
//   console.log(reponse.data)
};