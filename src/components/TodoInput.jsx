import { useState, useEffect } from "react";
import { postTDS } from "../APIs/todo_API_Calls";
import "./style.css";

function TodoInput({ tds, fetchTDS }) {
  const [titleError, setTitleError] = useState("");
  const [dateError, setDateError] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  
  // Get tomorrow's date for default value (as required by backend)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedTomorrow = tomorrow.toISOString().split('T')[0];
  
  // Clear notification after timeout
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  async function handleSubmit(event) {
    event.preventDefault();
    // grab the real <form> node before any await/async
    const form = event.currentTarget;
  
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTitleError("");
    setDateError("");
    setNotification({ message: "", type: "" });
  
    const formData   = new FormData(form);
    const title      = (formData.get("todo") || "").toString().trim();
    const deadlineStr = formData.get("deadline")?.toString() || formattedTomorrow;
  
    if (!title) {
      setTitleError("Please enter a task title");
      setIsSubmitting(false);
      return;
    }
  
    // build ISO deadline
    const selDate = new Date(deadlineStr);
    const today   = new Date();
    if (selDate.toDateString() === today.toDateString()) {
      selDate.setHours(23, 59, 59);
    } else {
      selDate.setHours(12, 0, 0);
    }
  
    const newTodo = {
      title,
      deadline: selDate.toISOString(),
      isCompleted: false,
      priority: 0,
    };
  
    try {
      console.log("Submitting todo:", newTodo);
      const response = await postTDS(newTodo);
      console.log("Server response:", response);
  
      // reset the form using the stored reference
      form.reset();
      form.querySelector("input[name=deadline]").value = formattedTomorrow;
  
      // only treat it as success if the backend sent exactly `"Todo Added"`
      if (response.msg === "Todo Added") {
        await fetchTDS();
        setNotification({ message: "Task added successfully!", type: "success" });
      } else {
        setNotification({
          message: `Unexpected response: ${response.msg ?? JSON.stringify(response)}`,
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error occurred while posting todo:", err);
      setNotification({
        message: err.message || "Failed to add task. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  
  
  return (
    <div className="mb-6">
      {notification.message && (
        <div className={`border px-4 py-3 rounded relative mb-4 transition-opacity duration-300 ${
          notification.type === "success" 
            ? "bg-green-100 border-green-400 text-green-700" 
            : "bg-red-100 border-red-400 text-red-700"
        }`}>
          <span className="block sm:inline">{notification.message}</span>
        </div>
      )}
      
      <form 
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-800 rounded-2xl p-4 shadow-md"
      >
        <div className="flex-1 w-full">
          <input
            type="text"
            name="todo"
            placeholder="Enter a new task..."
            className={`w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 ${
              titleError ? "border-2 border-red-500" : ""
            }`}
            disabled={isSubmitting}
          />
          {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
        </div>
        
        <div className="relative">
          <input
            className="bg-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            type="date"
            name="deadline"
            min={formattedToday}
            defaultValue={formattedTomorrow}
            disabled={isSubmitting}
          />
          {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}
        </div>
        
        <button
          type="submit"
          className={`${
            isSubmitting 
              ? "bg-gray-500 cursor-not-allowed" 
              : "bg-green-600 hover:bg-green-500 cursor-pointer"
          } text-white p-3 rounded-lg transition-all duration-300`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            // Simple loading spinner
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}

export default TodoInput;