import { useState } from 'react';
import { deleteTD,UpdateTD } from '../APIs/getTDS';
import { format } from "date-fns";
import "./todo-list.css"
function TodoList({ tds, fetchTDS }) {

    async function handleClick(todo) {
        await deleteTD(todo);
        fetchTDS();
    }

    async function todoStatusChange(ID,iscompleted){
        await UpdateTD(ID,iscompleted);
        fetchTDS();
    }
    

    return (
        <>
            < >
            <h4 style={{marginBottom:"1px"}}>Tasks to do - {tds.filter(todo=>!todo.iscompleted).length}</h4>
            <div className='todo-section'>
            {tds.filter(todo=>!todo.iscompleted)
            .map((todo,index)=>(
                <p key={index} className='task-card'>
                <button className="btn btn-iscomplete" onClick={()=>todoStatusChange(todo._id,todo.iscompleted)}>❌</button>
                {todo.title}
                <span style={{paddingLeft:'10px' }}>{format(new Date(todo.deadline), 'EEE, dd/MM/yyyy')}</span>
                        
                        <button className='btn btn-delete' onClick={() => handleClick(todo._id)}>
                            <img src="https://cdn-icons-png.flaticon.com/512/484/484662.png" alt="delete" />
                        </button>
                </p>

            ))}
            </div>
            </>

        <>
            <h4 style={{marginBottom:"0px"}}>Tasks completed - {tds.filter(todo=>todo.iscompleted).length}</h4>
            <div className='todo-completed-section '>
            {tds.filter(todo=>todo.iscompleted)
            .map((todo,index)=>(
                <p key={index} className='task-card'>
                <button className="btn btn-iscomplete" onClick={()=>todoStatusChange(todo._id,todo.iscompleted)}>✅</button>
                {todo.title}
                <span style={{paddingLeft:'10px' }}>{format(new Date(todo.deadline), 'EEE, dd/MM/yyyy')}</span>
                        
                        <button className='btn btn-delete' onClick={() => handleClick(todo._id)}>
                            <img src="https://cdn-icons-png.flaticon.com/512/484/484662.png" alt="delete" />
                        </button>
                </p>
            ))
            }
            </div>
            </>    
            
            {/* <h3>Tasks to do - </h3>
                {tds.map((todo, index) => (
                    <p key={index} className='task-card'>
                        {todo.iscompleted?
                        <button className="btn btn-iscomplete" onClick={()=>todoStatusChange(todo._id,todo.iscompleted)}>✅</button>:
                        <button className="btn btn-iscomplete" onClick={()=>todoStatusChange(todo._id,todo.iscompleted)}>❌</button>
                        }

                        {todo.title}
                        <span style={{paddingLeft:'10px' }}>{format(new Date(todo.deadline), 'EEE, dd/MM/yyyy')}</span>
                        
                        <button className='btn btn-delete' onClick={() => handleClick(todo._id)}>
                            <img src="https://cdn-icons-png.flaticon.com/512/484/484662.png" alt="delete" />
                        </button>
                    </p>
                ))}
            <h3>Done - </h3> */}
        </>
    );
}

export default TodoList;
