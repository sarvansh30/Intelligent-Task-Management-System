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
  const [navFilter, setNavFilter] = useState(1);

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

  // Force re-render of TodoList when navFilter changes
  useEffect(() => {
    console.log("Filter changed to:", navFilter);
  }, [navFilter]);

  const [res, setRes] = useState("");
  const [navopen, setNavButton] = useState(true);
  const [helperTabOpen, setHelperTabOpen] = useState(true);
 
  return(
    <div className="flex flex-col h-screen">
      <Header></Header>
      <main className="flex flex-row flex-grow overflow-hidden text-white">
        
        <nav className="p-6 transition-all duration-500 overflow-hidden border-r border-green-400 w-60 text-white h-screen font-extrabold">
          <ul className="flex flex-col gap-2 text-lg">
            <li>
              <button
                onClick={() => setNavFilter(1)}
                className={`block w-full text-left px-4 py-2 rounded-md transition ${
                  navFilter === 1 ? "bg-zinc-800 text-green-400" : "hover:bg-zinc-800 hover:text-green-400"
                }`}
              >
                All
              </button>
            </li>
            <li>
              <button
                onClick={() => setNavFilter(2)}
                className={`block w-full text-left px-4 py-2 rounded-md transition ${
                  navFilter === 2 ? "bg-zinc-800 text-green-400" : "hover:bg-zinc-800 hover:text-green-400"
                }`}
              >
                Today
              </button>
            </li>
            <li>
              <button
                onClick={() => setNavFilter(3)}
                className={`block w-full text-left px-4 py-2 rounded-md transition ${
                  navFilter === 3 ? "bg-zinc-800 text-green-400" : "hover:bg-zinc-800 hover:text-green-400"
                }`}
              >
                Pending
              </button>
            </li>
            <li>
              <button
                onClick={() => setNavFilter(4)}
                className={`block w-full text-left px-4 py-2 rounded-md transition ${
                  navFilter === 4 ? "bg-zinc-800 text-green-400" : "hover:bg-zinc-800 hover:text-green-400"
                }`}
              >
                Completed
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex-grow p-4">
          <TodoInput tds={list} fetchTDS={fetchTodos} />
          {/* Pass navFilter explicitly as a number */}
          <TodoList 
            tds={list} 
            fetchTDS={fetchTodos} 
            setResp={setRes} 
            navFilter={Number(navFilter)} 
          />
        </div>

        <div
          className={`relative transition-all duration-700 border-l border-green-400 text-white flex flex-col h-full ${
            helperTabOpen ? "w-[30rem] p-6" : "w-5 p-1"
          }`}
        >
          {/* Content: Show only when open */}
          {helperTabOpen && (
            <div className="flex-1 overflow-y-auto">
              <AIHelper fetchTDS={fetchTodos} setResp={setRes} resp={res} />
            </div>
          )}

          {/* Toggle Button */}
          <button
            type="button"
            onClick={() => setHelperTabOpen(!helperTabOpen)}
            className="absolute top-6 right-6 text-cyan-300 hover:bg-zinc-700 rounded-full p-2 transition"
          >
            {helperTabOpen ? "▶" : "◀"}
          </button>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
}

export default TodoApp;