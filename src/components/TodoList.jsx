import { deleteTD, UpdateTD } from '../APIs/todo_API_Calls';
import { format } from "date-fns";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { motion, AnimatePresence } from 'framer-motion';
import "./todo-list.css";

function TodoList({ tds, fetchTDS, setResp, navFilter }) {
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
    .sort((a, b) => b.priority - a.priority);

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
    const token = localStorage.getItem("token");
    if (!token) return console.error("Token not found");

    setResp("");
    fetchEventSource(`https://intelligent-task-management-system-ogpt.onrender.com/todoapp/task-help?_id=${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      onmessage: (event) => setResp(prev => prev + event.data),
      onerror: (error) => console.error("Stream error:", error),
    });
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 3:
        return { label: 'High', color: 'bg-red-500' };
      case 2:
        return { label: 'Medium', color: 'bg-yellow-500' };
      case 1:
      default:
        return { label: 'Low', color: 'bg-green-500' };
    }
  };

  // Framer Motion variants for cards
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    hover: { scale: 1.01 },
  };
  const cardTransition = {
    type: "spring",
    stiffness: 200,
    damping: 20,
    duration: 0.4,
  };

  // Button hover transition
  const btnHover = { scale: 1.03 };
  const btnTransition = { type: "spring", stiffness: 300, damping: 25 };

  return (
    <div className="mt-4">
      {filteredTodos.length === 0 ? (
        <motion.p
          className="text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          No tasks to display for the selected filter.
        </motion.p>
      ) : (
        <AnimatePresence>
          {filteredTodos.map(todo => {
            const priorityInfo = getPriorityInfo(todo.priority);
            return (
              <motion.div
                key={todo._id}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover="hover"
                transition={cardTransition}
                className="bg-zinc-800 rounded-2xl p-4 shadow-md mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div className="flex items-center gap-4 w-full">
                  <motion.button
                    onClick={() => handleToggleStatus(todo._id, todo.isCompleted)}
                    title="Toggle status"
                    whileHover={btnHover}
                    transition={btnTransition}
                    className="text-2xl text-white"
                  >
                    {todo.isCompleted ? "✅" : "❌"}
                  </motion.button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold break-words text-white">
                        {todo.title}
                      </h2>
                      <span
                        className={`text-xs font-medium text-white px-2 py-1 rounded ${priorityInfo.color}`}
                        title={`Priority: ${priorityInfo.label}`}
                      >
                        {priorityInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 font-medium mt-1">
                      Deadline: {format(new Date(todo.deadline), 'EEE, dd/MM/yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex mt-4 sm:mt-0 sm:gap-3 gap-2 sm:justify-end">
                  <motion.button
                    onClick={() => handleAiHelp(todo._id)}
                    className="bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-1.5 rounded-lg text-sm"
                    whileHover={btnHover}
                    transition={btnTransition}
                  >
                    AI Help
                  </motion.button>

                  <motion.button
                    onClick={() => handleDelete(todo._id)}
                    title="Delete task"
                    className="
                      flex items-center justify-center
                      bg-red-900 hovered:bg-red-800
                      p-2 rounded-full
                    "
                    whileHover={{ scale: 1.05 }}
                    transition={btnTransition}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/484/484662.png"
                      alt="delete"
                      className="w-5 h-5 filter invert"
                    />
                  </motion.button>
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
