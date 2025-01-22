
import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

import { getTDS } from "./APIs/getTDS";

function App() {

  const fetchTodos = async ()=>{
    try{
      const data =await getTDS();
      setList([...data]);
      // console.log(list);
    }catch(err){
      console.log(err);
    }
  }

  const [list,setList]=useState([]);

  useEffect(()=>{
    fetchTodos();
    // console.log(list.title);
  }
  ,[]);


  return (
    <>
      <Header />
      <TodoInput tds={list} fetchTDS={fetchTodos}/>
      <TodoList tds={list}  fetchTDS={fetchTodos}/>
      <Footer />
    </>
  );
}

export default App;
