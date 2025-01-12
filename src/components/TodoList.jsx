import {useState,useEffect} from 'react';
function TodoList({tds}){
    // const todos= useState[TodoList,setList()];

    return(
        <div>
            <h3>Todo List</h3>
            <ol>
                {
                    tds.map((todo,index)=>{
                        return (<li key={index}>{todo}</li>)
})
                }
            </ol>
        </div>
    );
}

export default TodoList;