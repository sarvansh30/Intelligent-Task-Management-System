import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import TodoApp from "./pages/TodoApp";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodoApp />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
