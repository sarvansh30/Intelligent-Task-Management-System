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
        <div>
            <div>
            <h4>Tasks to do - </h4>
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

        <div>
            <h4>Tasks completed - </h4>
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
        </div>
    );
}

export default TodoList;
