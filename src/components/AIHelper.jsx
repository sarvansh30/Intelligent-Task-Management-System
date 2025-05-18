import React, { useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import ReactMarkdown from "react-markdown";
import { PrioritiseHelperAi } from "../APIs/todo_API_Calls";

function AIHelper({ fetchTDS, setResp, resp }) {
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);

  async function callHelperAi() {
    try {
      setIsPrioritizing(true);
      await PrioritiseHelperAi();
      fetchTDS();
    } catch (e) {
      console.error(e);
    } finally {
      setIsPrioritizing(false);
    }
  }

  async function callPlanMyDay() {
    const token = localStorage.getItem("token");
    if (!token) return console.error("Token missing");
    setResp("");
    setIsPlanning(true);
    fetchEventSource("https://intelligent-task-management-system-ogpt.onrender.com/todoapp/plan-my-day", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      onmessage: (e) => setResp((p) => p + e.data),
      onerror: (err) => {
        console.error("Stream error:", err);
        setIsPlanning(false);
      },
      onclose: () => {
        setIsPlanning(false);
      }
    });
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-[var(--color-accent-secondary)]/20">
        <h3 className="text-[var(--color-text-primary)] text-xl font-bold flex items-center">
          <span className="bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">Helper.ai</span>
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]">Mistral-powered</span>
        </h3>
      </div>

      {/* Buttons side by side */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={callHelperAi}
          disabled={isPrioritizing}
          className={`flex-1 py-2 rounded-xl bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] hover:opacity-90 text-white font-medium transition shadow-md flex items-center justify-center ${isPrioritizing ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isPrioritizing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Prioritizing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
              Prioritise tasks
            </>
          )}
        </button>
        <button
          onClick={callPlanMyDay}
          disabled={isPlanning}
          className={`flex-1 py-2 rounded-xl bg-gradient-to-r from-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] hover:opacity-90 text-white font-medium transition shadow-md flex items-center justify-center ${isPlanning ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isPlanning ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Planning...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Plan my day
            </>
          )}
        </button>
      </div>

      {/* Streamed response */}
      <div className="flex-1 overflow-y-auto rounded-xl bg-[var(--color-bg-tertiary)]/50 backdrop-blur-sm p-4 text-[var(--color-text-secondary)] text-sm leading-relaxed border border-[var(--color-accent-secondary)]/10 shadow-inner">
        {resp ? (
          <div className="prose prose-invert max-w-none prose-headings:text-[var(--color-accent-primary)] prose-a:text-[var(--color-accent-secondary)]">
            <ReactMarkdown>
              {resp.trim()}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 mb-4 text-[var(--color-accent-secondary)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.62 2.54a1 1 0 011.76 0l2.484 4.692 5.548.844a1 1 0 01.554 1.706l-4.006 3.9.944 5.514a1 1 0 01-1.45 1.054L12 17.904 6.55 20.25a1 1 0 01-1.45-1.054l.944-5.514-4.006-3.9a1 1 0 01.554-1.706l5.548-.844L11.62 2.54z"/>
              </svg>
            </div>
            <p className="text-[var(--color-text-tertiary)] text-center">
              Your AI-powered plan will appear here<br />
              <span className="text-xs opacity-70">Choose an option above to get started</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIHelper;
