// import { postTDS } from "../APIs/getTDS";
import { postTDS } from "../APIs/todo_API_Calls";
import "./style.css"

function TodoInput({tds,fetchTDS}){

    
    async function handleSubmit(event){
        event.preventDefault();
        console.log("Form Submitted");
        const formData= new FormData(event.currentTarget);
        const title = formData.get("todo");
        const deadline = formData.get("deadline");
        const newTodo ={ "title":title};
        if(deadline){
           newTodo["deadline"] = deadline; 
        }
        
        event.currentTarget.reset();
        // console.log(typeof(newTodo))
        postTDS(newTodo)
        .then((data) => {
            console.log("Todo posted successfully:", data);
            fetchTDS();
        })
        .catch((error) => {
            console.error("Error occurred while posting todo:", error);
        });
        // setTdList(newList=>[...tds,newTodo]);
        // console.log(tds);
    }
    return(
            <form onSubmit={handleSubmit}>
                <input  type="text" 
                name="todo" 
                required="true"
                placeholder="Enter a todo..."/>
                <input className="deadline"
                    type="date"
                    name="deadline"
                    // required="true"
                    />
                <button  type="submit">
                    <img src="src/assets/icons8-plus-24.png" alt="ADD" />
                </button>
            </form>
    );
}

export default TodoInput;