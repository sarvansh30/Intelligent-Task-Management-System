import api from "./base_API";

export const getTDS = async () => {
    try {
        const response = await api.get('/todoapp'); 
        console.log(response.data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
          // Redirect to login page
          window.location.href = "/"; 
        }}
};

export const postTDS =async (newTodo)=>{
    try {
        const reponse=await api.post('/todoapp/addTodo',newTodo);
        // getTDS();
        return reponse.data
    } catch (error) {
        console.log(error);
    }
};

export const deleteTD=async (todoID)=>{
    try {
        const response= await api.delete('/todoapp/deleteTodo',{
            params: {_id:todoID}
        }) ;
        return response.data
    } catch (error) {
        console.log(error);
    }
};

export const UpdateTD= async (todoID,iscompleted)=>{
    const reponse =await api.put('/todoapp/updateTodo',null,{
        params:{"_id":todoID,
            "todoStatus":iscompleted
        }
    });
    return reponse.data;
};

export const PrioritiseHelperAi = async ()=>{
    try{
  await api.put('/todoapp/helper-ai-priority'); }
  catch(error){
    console.log(error);
  }
//   console.log(reponse.data)
};


  