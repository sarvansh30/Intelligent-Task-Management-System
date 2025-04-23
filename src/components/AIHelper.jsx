import React from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import ReactMarkdown from "react-markdown";
import { PrioritiseHelperAi } from "../APIs/todo_API_Calls";
import remarkGfm from 'remark-gfm'

function AIHelper(props) {
  async function callHelperAi() {
    try {
      await PrioritiseHelperAi();
      console.log("Helper AI did the priority task");
      props.fetchTDS();
    } catch (error) {
      console.error("Error occurred while posting todo:", error);
    }
  }

  async function callPlanMyDay() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }
    props.setResp("");
    fetchEventSource("http://localhost:8000/todoapp/plan-my-day", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      onmessage: (event) => {
        props.setResp((prev) => prev + event.data);
      },
      onerror: (error) => {
        console.error("Stream error:", error);
      },
    });
  }
  function CustomTextRenderer({ text }) {
    // Split the text into lines, preserving empty lines
    const lines = text.split('\n');
  
    // Array to hold rendered elements
    const elements = [];
    let currentList = null; // Track ongoing list
  
    lines.forEach((line, index) => {
      // Remove leading/trailing whitespace for pattern matching
      const trimmedLine = line.trim();
  
      if (trimmedLine.startsWith('## ')) {
        // Render heading (## Heading)
        elements.push(<h2 key={index} className="text-lg font-bold mt-2">{trimmedLine.substring(3)}</h2>);
        currentList = null; // End any ongoing list
      } else if (trimmedLine.startsWith('- ')) {
        // Start or continue a list
        if (!currentList) {
          currentList = [];
          elements.push(<ul key={`ul-${index}`} className="list-disc pl-5">{currentList}</ul>);
        }
        currentList.push(<li key={index}>{trimmedLine.substring(2)}</li>);
      } else if (trimmedLine === '') {
        // Empty line ends a list and adds spacing
        currentList = null;
        elements.push(<div key={index} className="my-2" />);
      } else {
        // Regular paragraph text
        currentList = null; // End any ongoing list
        elements.push(<p key={index} className="mb-2">{line}</p>);
      }
    });
  
    return <div>{elements}</div>;
  }
  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
  <div>
    <h2 className="text-xl font-semibold text-green-300 ">Helper.ai</h2>
    <p className="text-sm text-gray-400 mb-2">(Powered by Mistral.ai)</p>
    <div className="flex gap-2">
      <button
        onClick={callHelperAi}
        className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
      >
        Prioritise Tasks
      </button>
      <button
        onClick={callPlanMyDay}
        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
      >
        Plan My Day
      </button>
    </div>
  </div>

  {/* Scrollable output area */}
  <div className="flex-1 overflow-y-auto bg-zinc-900 p-4 rounded text-sm whitespace-pre-wrap break-words">
  <CustomTextRenderer text={props.resp} />
</div>

  {/* Input pinned to bottom */}
  <div className="mt-auto">
    <input
      type="text"
      className="w-full border border-zinc-600 bg-zinc-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
      placeholder="Ask something..."
    />
  </div>
</div>

  );
}

export default AIHelper;
