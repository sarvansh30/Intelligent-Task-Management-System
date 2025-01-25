import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

import { getTDS } from "./APIs/getTDS";
import AIHelper from "./components/AIHelper";

function App() {
  const fetchTodos = async () => {
    try {
      const data = await getTDS();
      setList([...data]);
      // console.log(list);
    } catch (err) {
      console.log(err);
    }
  };

  const [list, setList] = useState([]);

  useEffect(() => {
    fetchTodos();
    // console.log(list.title);
  }, []);

  return (
    <div div className="BOD">
      <Header className="Head"/>
      <div className="container">
        <div className="Mainsection1">
        <TodoInput tds={list} fetchTDS={fetchTodos} />
        <TodoList tds={list} fetchTDS={fetchTodos} />
        </div>
        <AIHelper className="Mainsection2"/>
      </div>
      <Footer />
    </div>
  );
}

export default App;
