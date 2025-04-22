import { useEffect, useState } from "react";
import "./TodoApp.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TodoInput from "../components/TodoInput";
import TodoList from "../components/TodoList";

// import { getTDS } from "../APIs/getTDS";
import { getTDS } from "../APIs/todo_API_Calls";
import AIHelper from "../components/AIHelper";

function TodoApp(props) {
  const [list, setList] = useState([]);
  const fetchTodos = async () => {
    try {
      const data = await getTDS();
    
      setList([...data]);
      // console.log(list);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTodos();
    // console.log(list.title);
  }, []);

  const [res, setRes] = useState("");
  const [navopen,setNavButton] = useState(true);
  const [helperTabOpen,setHelperTabOpen] = useState(true);
 
  return(
    <div className="flex flex-col h-screen items-center" >
      <Header></Header>
      <main className="flex flex-row flex-grow text-white" >
        
        <nav className={`p-4 transition-all duration-500 overflow-hidden ${navopen ? "w-45":"w-0"}`} >
          <ul>
            <li> <a href="#">All</a></li>
            <li> <a href="#">Today</a></li>
            <li> <a href="#">Completed</a></li>
          </ul>
        </nav>
        <button type="button"
        onClick={()=> setNavButton(!navopen)} >
          {navopen?"◀" : "▶"}
        </button>

        <div className="flex-grow p-4">
        <TodoInput tds={list} fetchTDS={fetchTodos} />
         <TodoList tds={list} fetchTDS={fetchTodos} setResp={setRes} />
         </div>

         <div className={`p-4 transition-all duration-700 overflow-hidden ${helperTabOpen?"w-120":"w-5"}`}>
            <AIHelper fetchTDS={fetchTodos} setResp={setRes} resp = {res}/>
            <button type="button"
              onClick={()=> setHelperTabOpen(!helperTabOpen)} >
              {helperTabOpen?"▶":"◀" }
            </button>
         </div>

      </main>
      <Footer></Footer>
    </div>
  );
}

export default TodoApp;
