import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import TodoApp from "./pages/TodoApp";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignupPage";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/todoapp" element={<TodoApp />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
