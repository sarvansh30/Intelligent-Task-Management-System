import "./style.css"
import { PrioritiseHelperAi } from "../APIs/getTDS";



function AIHelper(props){

    async function callHelperAi(){
        await PrioritiseHelperAi()
        .then(() => {
            console.log("Helper AI did the priority task");
            props.fetchTDS();
        })
        .catch((error) => {
            console.error("Error occurred while posting todo:", error);
        });
        return
    }

    return(
        <div className="body">
        <h2>Helper.ai</h2>
        <button className="btn submit-btn" onClick={callHelperAi}>Prioritise tasks</button>
        </div>
    )
};

export default AIHelper;