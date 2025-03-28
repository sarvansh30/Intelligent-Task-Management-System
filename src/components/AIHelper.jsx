import "./style.css"
import { PrioritiseHelperAi } from "../APIs/getTDS";
import { useState } from "react";



function AIHelper(props){

    const [resp,setResp]= useState("");

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
        <h2>Helper.ai <span style={{fontSize:"13px"}}>(Powered by Mistral.ai)</span></h2>
        <button className="btn submit-btn" onClick={callHelperAi}>Prioritise tasks</button>
        <button className="btn submit-btn">Plan my day</button>
        <div className="AI-helper-bod">{resp}</div>
        <input type="text" className="AI-text-input"></input>
        </div>
    )
};

export default AIHelper;