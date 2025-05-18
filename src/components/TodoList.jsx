import { deleteTD, UpdateTD } from '../APIs/todo_API_Calls';
import { format } from "date-fns";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import "./todo-list.css";

function TodoList({ tds, fetchTDS, setResp, navFilter }) {
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [error, setError] = useState(null);

  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const filterTodos = () => {
    if (!tds || tds.length === 0) return [];
    switch (navFilter) {
      case 2:
        return tds.filter(todo => isToday(todo.deadline) && !todo.isCompleted);
      case 3:
        return tds.filter(todo => !todo.isCompleted);
      case 4:
        return tds.filter(todo => todo.isCompleted);
      case 1:
      default:
        return tds;
    }
  };

  const filteredTodos = filterTodos()
    .slice()
    .sort((a, b) => {
      // First sort by completion status
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      // Then sort by priority
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      // Finally sort by deadline
      return new Date(a.deadline) - new Date(b.deadline);
    });

  const handleDelete = async (id) => {
    try {
      await deleteTD(id);
      fetchTDS();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await UpdateTD(id, currentStatus);
      fetchTDS();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleAiHelp = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token missing. Please log in again.");
        return;
      }
      
      setLoadingTaskId(id);
      setError(null);
      setResp("");
      
      fetchEventSource(`https://intelligent-task-management-system-ogpt.onrender.com/todoapp/task-help?_id=${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        onmessage: (event) => setResp(prev => prev + event.data),
        onerror: (error) => {
          console.error("Stream error:", error);
          setError("Failed to get AI help. Server might be unavailable.");
          setLoadingTaskId(null);
        },
        onclose: () => {
          setLoadingTaskId(null);
        }
      });
    } catch (e) {
      console.error("Failed to get AI help:", e);
      setError("Error connecting to the server. Please try again later.");
      setLoadingTaskId(null);
    }
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 3:
        return { 
          label: 'High', 
          color: 'bg-[var(--color-danger)]',
          borderColor: 'border-[var(--color-danger)]',
          bgColor: 'bg-[var(--color-danger)]/5',
          icon: '🔴'
        };
      case 2:
        return { 
          label: 'Medium', 
          color: 'bg-[var(--color-warning)]',
          borderColor: 'border-[var(--color-warning)]', 
          bgColor: 'bg-[var(--color-warning)]/5',
          icon: '🟠'
        };
      case 1:
      default:
        return { 
          label: 'Low', 
          color: 'bg-[var(--color-success)]',
          borderColor: 'border-[var(--color-success)]',
          bgColor: 'bg-[var(--color-success)]/5',
          icon: '🟢'
        };
    }
  };

  // Framer Motion variants for cards
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    hover: { 
      scale: 1.01,
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)'
    },
  };
  
  const cardTransition = {
    type: "spring",
    stiffness: 200,
    damping: 20,
    duration: 0.4,
  };

  // Button hover transition
  const btnHover = { scale: 1.05 };
  const btnTransition = { type: "spring", stiffness: 300, damping: 25 };

  return (
    <div className="mt-6 space-y-3">
      {filteredTodos.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center text-center p-8 bg-[var(--color-bg-secondary)]/50 rounded-2xl backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <svg className="w-16 h-16 mb-4 text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p className="text-[var(--color-text-secondary)] text-lg font-medium">
            No tasks to display for the selected filter.
          </p>
          <p className="text-[var(--color-text-tertiary)] mt-2">
            Add a new task to get started!
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {filteredTodos.map(todo => {
            const priorityInfo = getPriorityInfo(todo.priority);
            const deadlineDate = new Date(todo.deadline);
            const isOverdue = !todo.isCompleted && deadlineDate < new Date();
            
            return (
              <motion.div
                key={todo._id}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover="hover"
                transition={cardTransition}
                className={`bg-[var(--color-bg-secondary)] rounded-xl p-3 shadow-md border-l-4 ${
                  todo.isCompleted 
                    ? "border-l-gray-400 opacity-75" 
                    : priorityInfo.borderColor
                } ${todo.isCompleted ? "" : priorityInfo.bgColor} backdrop-blur-sm`}
              >
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => handleToggleStatus(todo._id, todo.isCompleted)}
                    title={todo.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                    whileHover={btnHover}
                    whileTap={{ scale: 0.95 }}
                    transition={btnTransition}
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                      todo.isCompleted 
                        ? "bg-[var(--color-success)] border-[var(--color-success)]" 
                        : "border-[var(--color-text-tertiary)] hover:border-[var(--color-accent-primary)]"
                    }`}
                  >
                    {todo.isCompleted && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </motion.button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <h2 className={`text-base font-medium break-words ${todo.isCompleted ? "line-through text-[var(--color-text-tertiary)]" : "text-[var(--color-text-primary)]"}`}>
                        {todo.title}
                      </h2>
                      <div className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full ${priorityInfo.color}/20 text-${priorityInfo.color.split('-')[1]}-300`}>
                        <span>{priorityInfo.icon}</span>
                        <span>{priorityInfo.label}</span>
                      </div>
                    </div>
                    
                    <div className={`inline-block text-xs font-medium px-1.5 py-0.5 rounded-md mt-0.5 ${
                      isOverdue && !todo.isCompleted
                        ? "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                        : isToday(todo.deadline) && !todo.isCompleted
                          ? "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
                          : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
                    }`}>
                      {isOverdue && !todo.isCompleted ? "⚠️ Overdue: " : "📅 "}
                      {format(deadlineDate, 'EEE, dd MMM yyyy')}
                    </div>
                  </div>

                  <div className="flex gap-1 self-center">
                    <motion.button
                      onClick={() => handleAiHelp(todo._id)}
                      disabled={loadingTaskId !== null}
                      className={`bg-gradient-to-r from-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] hover:opacity-90 text-white px-2.5 py-1 rounded-lg text-xs font-medium shadow-md flex items-center gap-1 h-7 ${loadingTaskId === todo._id ? 'opacity-70 cursor-not-allowed' : ''}`}
                      whileHover={btnHover}
                      whileTap={{ scale: 0.95 }}
                      transition={btnTransition}
                    >
                      {loadingTaskId === todo._id ? (
                        <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      )}
                      AI
                    </motion.button>

                    <motion.button
                      onClick={() => handleDelete(todo._id)}
                      title="Delete task"
                      className="
                        bg-[var(--color-danger)]/10 hover:bg-[var(--color-danger)]/20 
                        p-1 rounded-lg text-[var(--color-danger)] h-7 w-7 flex items-center justify-center
                      "
                      whileHover={btnHover}
                      whileTap={{ scale: 0.95 }}
                      transition={btnTransition}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}

export default TodoList;
