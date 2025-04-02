import React, { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { PrioritiseHelperAi } from "../APIs/todo_API_Calls";
import ReactMarkdown from "react-markdown";
import "./style.css";

function AIHelper(props) {
  const [resp, setResp] = useState("");

  async function callHelperAi() {
    await PrioritiseHelperAi()
      .then(() => {
        console.log("Helper AI did the priority task");
        props.fetchTDS();
      })
      .catch((error) => {
        console.error("Error occurred while posting todo:", error);
      });
  }

  async function callPlanMyDay() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }
    setResp("");
    fetchEventSource("http://localhost:8000/todoapp/plan-my-day", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      onmessage: (event) => {
        setResp(prev => prev + event.data);
      },
      onerror: (error) => {
        console.error("Stream error:", error);
      }
    });
  }

  return (
    <div className="body">
      <h2>
        Helper.ai <span style={{ fontSize: "13px" }}>(Powered by Mistral.ai)</span>
      </h2>
      <button className="btn submit-btn" onClick={callHelperAi}>
        Prioritise tasks
      </button>
      <button className="btn submit-btn" onClick={callPlanMyDay}>
        Plan my day
      </button>
      <div className="AI-helper-bod">
        <ReactMarkdown>{resp}</ReactMarkdown>
      </div>
      <input type="text" className="AI-text-input" />
    </div>
  );
}

export default AIHelper;
