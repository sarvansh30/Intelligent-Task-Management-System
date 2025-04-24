import React from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import ReactMarkdown from "react-markdown";
import { PrioritiseHelperAi } from "../APIs/todo_API_Calls";

function AIHelper({ fetchTDS, setResp, resp }) {
  async function callHelperAi() {
    try {
      await PrioritiseHelperAi();
      fetchTDS();
    } catch (e) {
      console.error(e);
    }
  }

  async function callPlanMyDay() {
    const token = localStorage.getItem("token");
    if (!token) return console.error("Token missing");
    setResp("");
    fetchEventSource("https://intelligent-task-management-system-ogpt.onrender.com/plan-my-day", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      onmessage: (e) => setResp((p) => p + e.data),
      onerror: (err) => console.error("Stream error:", err),
    });
  }

  return (
    <aside className="flex flex-col h-full w-full bg-zinc-800 p-4 gap-4 overflow-hidden">
      {/* Header */}
      <div>
        <h3 className="text-white text-xl font-bold">Helper.ai</h3>
        <p className="text-[#777] text-sm">(Powered by Mistral.ai)</p>
      </div>

      {/* Buttons side by side */}
      <div className="flex space-x-2">
        <button
          onClick={callHelperAi}
          className="flex-1 py-2 rounded bg-green-600 hover:bg-green-500 hover:cursor-pointer text-white font-medium transition"
        >
          Prioritise tasks
        </button>
        <button
          onClick={callPlanMyDay}
          className="flex-1 py-2 rounded bg-green-600 hover:bg-green-500 hover:cursor-pointer text-white font-medium transition"
        >
          Plan my day
        </button>
      </div>

      {/* Streamed response */}
      <div className="flex-1 overflow-y-auto bg-zinc-800 p-3 rounded text-[#ddd] text-sm leading-relaxed">
        {resp ? (
          <ReactMarkdown>{resp.trim()}</ReactMarkdown>
        ) : (
          <p className="text-[#555] italic">Your plan will appear here…</p>
        )}
      </div>
    </aside>
  );
}

export default AIHelper;
