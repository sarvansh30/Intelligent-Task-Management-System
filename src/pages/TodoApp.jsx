import React, { useEffect, useState, useRef } from "react";
import "./TodoApp.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TodoInput from "../components/TodoInput";
import TodoList from "../components/TodoList";
import { getTDS } from "../APIs/todo_API_Calls";
import AIHelper from "../components/AIHelper";
import { Rnd } from "react-rnd";

const TodoApp = () => {
  const [list, setList] = useState([]);
  const [navFilter, setNavFilter] = useState(1);
  const [helperOpen, setHelperOpen] = useState(false);
  const [res, setRes] = useState("");
  const [loading, setLoading] = useState(true);
  const [draggableMode, setDraggableMode] = useState(false);
  const containerRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState(0);

  // Calculate the max width based on 2/5 of the container width
  useEffect(() => {
    const updateMaxWidth = () => {
      if (containerRef.current) {
        setMaxWidth(Math.floor(window.innerWidth * 0.4)); // 2/5 = 0.4
      }
    };

    updateMaxWidth();
    window.addEventListener('resize', updateMaxWidth);
    return () => window.removeEventListener('resize', updateMaxWidth);
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTDS();
      setList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Navigation items with icons
  const navItems = [
    { id: 1, label: "All", icon: "📋" },
    { id: 2, label: "Today", icon: "📅" },
    { id: 3, label: "Pending", icon: "⏳" },
    { id: 4, label: "Completed", icon: "✅" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
      <div className="px-4 py-2">
        <Header />
      </div>
      <main ref={containerRef} className="flex flex-row flex-grow overflow-hidden text-[var(--color-text-primary)] relative">
        {/* Sidebar navigation with fixed width */}
        <nav className="bg-[var(--color-bg-secondary)] p-6 transition-all duration-500 shadow-md overflow-y-auto border-r border-[var(--color-accent-primary)]/20 min-w-[240px] w-[240px] flex-shrink-0 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-6 text-[var(--color-text-primary)] opacity-80">Dashboard</h2>
          <ul className="flex flex-col gap-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setNavFilter(item.id)}
                  className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                    navFilter === item.id
                      ? "bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] font-medium"
                      : "hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
                  }`}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                  {navFilter === item.id && (
                    <span className="ml-auto bg-[var(--color-accent-primary)] rounded-full w-1.5 h-6"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main content area */}
        <div className="flex-grow p-6 overflow-y-auto min-w-0">
          <TodoInput tds={list} fetchTDS={fetchTodos} />
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-accent-primary)]"></div>
            </div>
          ) : (
            <TodoList tds={list} fetchTDS={fetchTodos} setResp={setRes} navFilter={navFilter} />
          )}
        </div>

        {/* AI Helper - Resizable & Draggable version or Fixed version */}
        {draggableMode && helperOpen ? (
          <Rnd
            default={{
              x: Math.max(window.innerWidth - 450, window.innerWidth * 0.6),
              y: 100,
              width: 400,
              height: 500
            }}
            minWidth={300}
            minHeight={400}
            maxWidth={maxWidth}
            bounds="parent"
            dragHandleClassName="drag-handle"
            className="z-50"
          >
            <div className="rounded-xl shadow-xl border border-[var(--color-accent-secondary)]/30 bg-[var(--color-bg-secondary)] flex flex-col h-full overflow-hidden">
              <div className="drag-handle flex items-center justify-between p-3 border-b border-[var(--color-accent-primary)]/20 cursor-move bg-[var(--color-bg-tertiary)]">
                <div className="flex items-center">
                  <span className="bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent font-bold">Helper.ai</span>
                  <span className="ml-2 text-xs text-[var(--color-text-tertiary)]">Drag to move • Resize from edges</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setDraggableMode(false)}
                    className="p-1 hover:bg-[var(--color-bg-tertiary)] rounded text-[var(--color-text-secondary)]"
                    title="Dock to sidebar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setHelperOpen(false)}
                    className="p-1 hover:bg-[var(--color-bg-tertiary)] rounded text-[var(--color-text-secondary)]"
                    title="Close"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 overflow-hidden">
                <AIHelper fetchTDS={fetchTodos} setResp={setRes} resp={res} />
              </div>
            </div>
          </Rnd>
        ) : (
          <div
            className={`relative transition-all duration-700 border-l border-[var(--color-accent-secondary)]/20 flex flex-col h-full bg-[var(--color-bg-secondary)]/50 backdrop-blur-sm flex-shrink-0 ${
              helperOpen ? "min-w-[400px] w-[400px] p-5" : "w-5 p-1"
            }`}
          >
            {helperOpen && (
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setDraggableMode(true)}
                  className="rounded p-1.5 text-[var(--color-accent-secondary)] hover:bg-[var(--color-bg-tertiary)] transition"
                  title="Make draggable & resizable"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            )}
            <div
              className={`flex-1 overflow-y-auto transition-opacity duration-700 ease-in-out ${
                helperOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <AIHelper fetchTDS={fetchTodos} setResp={setRes} resp={res} />
            </div>

            <button
              onClick={() => setHelperOpen((prev) => !prev)}
              className={`absolute top-6 ${helperOpen ? 'right-6' : 'right-1'} text-[var(--color-accent-secondary)] 
              hover:bg-[var(--color-bg-tertiary)] rounded-full p-2.5 transition shadow-md
              bg-[var(--color-bg-secondary)] border border-[var(--color-accent-secondary)]/30`}
            >
              {helperOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TodoApp;
