
import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

import { getTDS } from "./APIs/getTDS";

function App() {

  const [list,setList]=useState([]);
  useEffect(()=>{
    const fetchTodos = async ()=>{
      try{
        const data =await getTDS();
        setList(newList=>[...list,...data]);
        console.log(list);
      }catch(err){
        console.log(err);
      }
    }
    fetchTodos();
    console.log(list);
  }
  ,[]);


  return (
    <>
      <Header />
      <TodoInput tds={list} setTdList={setList}/>
      <TodoList tds={list}/>
      <Footer />
    </>
  );
}

export default App;
