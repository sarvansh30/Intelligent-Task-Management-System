import { postTDS } from "../APIs/getTDS";
import "./style.css"
function TodoInput({tds,fetchTDS}){

    
    async function handleSubmit(event){
        event.preventDefault();
        console.log("Form Submitted");
        const formData= new FormData(event.currentTarget);
        const newTodo={
            "title":formData.get("todo"),
            "iscompleted":false,
            "deadline": formData.get("deadline")
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
            <form onSubmit={handleSubmit} className="form-container">
                <input className="Input-field" type="text" 
                name="todo" 
                placeholder="Enter a todo..."/>
                <input className="deadline"
                    type="date"
                    name="deadline"
                    />
                <button className="submit-btn" type="submit">ADD</button>
            </form>
    );
}

export default TodoInput;