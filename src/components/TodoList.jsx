import { useState } from 'react';
import { deleteTD } from '../APIs/getTDS';

function TodoList({ tds, fetchTDS }) {

    async function handleClick(todo) {
        await deleteTD(todo);
        fetchTDS();
    }

    

    return (
        <div>
            <h3>Todo List</h3>
            <ol>
                {tds.map((todo, index) => (
                    <li key={index}>
                        {todo.title}
                        <button >✅</button>
                        <button onClick={() => handleClick(todo._id)}>delete</button>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default TodoList;
