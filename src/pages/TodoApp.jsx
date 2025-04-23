import React, { useEffect, useState } from "react";
import "./TodoApp.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TodoInput from "../components/TodoInput";
import TodoList from "../components/TodoList";
import { getTDS } from "../APIs/todo_API_Calls";
import AIHelper from "../components/AIHelper";

const TodoApp = () => {
  const [list, setList] = useState([]);
  const [navFilter, setNavFilter] = useState(1);
  const [helperOpen, setHelperOpen] = useState(false);
  const [res, setRes] = useState("");

  const fetchTodos = async () => {
    try {
      const data = await getTDS();
      setList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex flex-row flex-grow overflow-hidden text-white">
        {/* Sidebar navigation */}
        <nav className="p-6 transition-all duration-500 overflow-hidden border-r border-green-400 w-60 font-extrabold">
          <ul className="flex flex-col gap-2 text-lg">
            {[
              { id: 1, label: "All" },
              { id: 2, label: "Today" },
              { id: 3, label: "Pending" },
              { id: 4, label: "Completed" },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setNavFilter(item.id)}
                  className={`block w-full text-left px-4 py-2 rounded-md transition ${
                    navFilter === item.id
                      ? "bg-zinc-800 text-green-400"
                      : "hover:bg-zinc-800 hover:text-green-400"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main content area */}
        <div className="flex-grow p-4 overflow-y-auto">
          <TodoInput tds={list} fetchTDS={fetchTodos} />
          <TodoList tds={list} fetchTDS={fetchTodos} setResp={setRes} navFilter={navFilter} />
        </div>

        {/* AI Helper sidebar with fade-in/out */}
        <div
          className={`relative transition-all duration-700 border-l border-green-400 flex flex-col h-full ${
            helperOpen ? "w-[40rem] p-6" : "w-5 p-1"
          }`}
        >
          <div
            className={`flex-1 overflow-y-auto transition-opacity duration-700 ease-in-out ${
              helperOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            <AIHelper fetchTDS={fetchTodos} setResp={setRes} resp={res} />
          </div>

          <button
            onClick={() => setHelperOpen((prev) => !prev)}
            className="absolute top-6 right-6 text-cyan-300 hover:bg-zinc-700 rounded-full p-2 transition"
          >
            {helperOpen ? "▶" : "◀"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TodoApp;
