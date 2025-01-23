import { useState } from 'react';
import { deleteTD,UpdateTD } from '../APIs/getTDS';
import { format } from "date-fns";

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
            <h3>Todo List</h3>
            <ol>
                {tds.map((todo, index) => (
                    <li key={index}>
                        {todo.title}
                        <span style={{paddingLeft:'10px' }}>{format(new Date(todo.deadline), 'EEE, dd/MM/yyyy')}</span>
                        {todo.iscompleted?
                        <button onClick={()=>todoStatusChange(todo._id,todo.iscompleted)}>✅</button>:
                        <button onClick={()=>todoStatusChange(todo._id,todo.iscompleted)}>❌</button>
                        }
                        
                        <button onClick={() => handleClick(todo._id)}>delete</button>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default TodoList;
