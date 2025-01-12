import { postTDS } from "../APIs/getTDS";

function TodoInput({tds,fetchTDS}){

    async function handleSubmit(event){
        event.preventDefault();
        console.log("Form Submitted");
        const formData= new FormData(event.currentTarget);
        const newTodo= formData.get("todo");
        console.log(typeof(newTodo))
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
                <input type="text" 
                name="todo" 
                placeholder="Enter a todo"/>
                <button type="submit">Add</button>
            </form>
    );
}

export default TodoInput;