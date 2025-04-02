import { useState } from 'react';
// import { deleteTD,UpdateTD } from '../APIs/getTDS';
import { deleteTD,UpdateTD } from '../APIs/todo_API_Calls';
import { format } from "date-fns";
import "./todo-list.css"
import { fetchEventSource } from "@microsoft/fetch-event-source";
import ReactMarkdown from "react-markdown";
function TodoList({ tds, fetchTDS ,setResp, resp}) {

    async function handleClick(todo) {
        await deleteTD(todo);
        fetchTDS();
    }

    async function todoStatusChange(ID,iscompleted){
        await UpdateTD(ID,iscompleted);
        fetchTDS();
    }
    
    async function handleAiHelp(id){
        const token = localStorage.getItem("token");
            if (!token) {
              console.error("Token not found in localStorage");
              return;
            }
            setResp("");
            fetchEventSource(`http://localhost:8000/todoapp/task-help?_id=${id}`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`
              },
              onmessage: (event) => {
                setResp(prev => prev + event.data);
              },
              onerror: (error) => {
                console.error("Stream error:", error);
              }
            });
    }

    return (
        <>
            < >
            <h4 style={{marginBottom:"1px"}}>Tasks to do - {tds.filter(todo=>!todo.isCompleted).length}</h4>
            <div className='todo-section'>
            {tds.slice()
            .sort((a,b)=> b.priority - a.priority)
            .filter(todo=>!todo.isCompleted)
            .map((todo,index)=>(
                <p key={index} className='task-card'>
                <button className="btn btn-iscomplete" onClick={()=>todoStatusChange(todo._id,todo.isCompleted)}>❌</button>
                {todo.title}
                <span style={{paddingLeft:'10px' }}>{format(new Date(todo.deadline), 'EEE, dd/MM/yyyy')}</span>
                
                <button className="btn" onClick={() => handleAiHelp(todo._id)} style={{paddingLeft:'10px' }}>AI Help?</button>

                        <button className='btn btn-delete' onClick={() => handleClick(todo._id)}>
                            <img src="https://cdn-icons-png.flaticon.com/512/484/484662.png" alt="delete" />
                        </button>
                </p>

            ))}
            </div>
            </>

        <>
            <h4 style={{marginBottom:"0px"}}>Tasks completed - {tds.filter(todo=>todo.isCompleted).length}</h4>
            <div className='todo-completed-section '>
            {tds.filter(todo=>todo.isCompleted)
            .map((todo,index)=>(
                <p key={index} className='task-card'>
                <button className="btn btn-iscomplete" onClick={()=>todoStatusChange(todo._id,todo.isCompleted)}>✅</button>
                {todo.title}
                <span style={{paddingLeft:'10px' }}>{format(new Date(todo.deadline), 'EEE, dd/MM/yyyy')}</span>

                {/* <button className="btn" onClick={() => handleAiHelp(todo)} >AI Help?</button> */}

                        <button className='btn btn-delete' onClick={() => handleClick(todo._id)}>
                            <img src="https://cdn-icons-png.flaticon.com/512/484/484662.png" alt="delete" />
                        </button>
                </p>
            ))
            }
            </div>
            </>    
            
        </>
    );
}

export default TodoList;
