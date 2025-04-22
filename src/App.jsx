import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import TodoApp from "./pages/TodoApp";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignupPage";
import "./App.css"
const App = () => {

  const [user,setUser]= useState("");
  return (
    <div className="bg-[#1D1E18]">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage setOwner={setUser}/>}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/todoapp" element={<TodoApp owner={user}/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  );
};

export default App;
