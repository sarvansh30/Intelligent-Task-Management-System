import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import TodoApp from "./pages/TodoApp";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignupPage";
const App = () => {

  const [user,setUser]= useState("");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage setOwner={setUser}/>}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/todoapp" element={<TodoApp owner={user}/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
