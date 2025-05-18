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
  
    const formData = new FormData(form);
    const title = (formData.get("todo") || "").toString().trim();
    const deadlineStr = formData.get("deadline")?.toString() || formattedTomorrow;
  
    if (!title) {
      setTitleError("Please enter a task title");
      setIsSubmitting(false);
      return;
    }
  
    // build ISO deadline
    const selDate = new Date(deadlineStr);
    const today = new Date();
    if (selDate.toDateString() === today.toDateString()) {
      selDate.setHours(23, 59, 59);
    } else {
      selDate.setHours(12, 0, 0);
    }
  
    const newTodo = {
      title,
      deadline: selDate.toISOString(),
      isCompleted: false,
      priority: 0, // Default priority (AI will determine the actual priority)
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
    <div className="mb-8">
      {notification.message && (
        <div className={`border-l-4 px-4 py-3 rounded-lg relative mb-6 transition-all duration-300 shadow-md ${
          notification.type === "success" 
            ? "bg-[var(--color-success)]/10 border-[var(--color-success)] text-[var(--color-success)]" 
            : "bg-[var(--color-danger)]/10 border-[var(--color-danger)] text-[var(--color-danger)]"
        }`}>
          <div className="flex items-center">
            <span className="flex-shrink-0 mr-2">
              {notification.type === "success" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </span>
            <span className="block font-medium">{notification.message}</span>
          </div>
        </div>
      )}
      
      <form 
        onSubmit={handleSubmit}
        className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-lg border border-[var(--color-bg-tertiary)]/80 backdrop-blur-sm"
      >
        <h2 className="text-xl font-bold mb-5 text-[var(--color-text-primary)]">Create a New Task</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label htmlFor="todo" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Task Description
            </label>
            <div className="relative">
              <input
                type="text"
                name="todo"
                id="todo"
                placeholder="What needs to be done?"
                className={`w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] 
                  px-4 py-3 rounded-xl border border-[var(--color-bg-tertiary)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]
                  focus:border-transparent transition-all duration-200
                  ${titleError ? "border-[var(--color-danger)]" : ""}`}
                disabled={isSubmitting}
              />
              {titleError && 
                <p className="text-[var(--color-danger)] text-sm mt-1 absolute">
                  {titleError}
                </p>
              }
            </div>
          </div>
          
          <div className="flex gap-4 items-end">
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                Deadline
              </label>
              <input
                className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] 
                  px-4 py-3 rounded-xl border border-[var(--color-bg-tertiary)] 
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]
                  focus:border-transparent transition-all duration-200"
                type="date"
                name="deadline"
                id="deadline"
                min={formattedToday}
                defaultValue={formattedTomorrow}
                disabled={isSubmitting}
              />
              {dateError && <p className="text-[var(--color-danger)] text-sm mt-1">{dateError}</p>}
            </div>
            
            <button
              type="submit"
              className={`
                h-12 px-6 rounded-xl shadow-lg transition-all duration-300
                flex items-center justify-center gap-1 font-medium text-white
                ${isSubmitting 
                  ? "bg-[var(--color-bg-tertiary)] cursor-not-allowed" 
                  : `bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] 
                    hover:from-[var(--color-accent-secondary)] hover:to-[var(--color-accent-primary)]
                    cursor-pointer`
                }
              `}
              disabled={isSubmitting}
              style={{
                boxShadow: !isSubmitting ? '0 4px 10px rgba(14, 165, 233, 0.25)' : 'none'
              }}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Add Task</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TodoInput;