import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TodoApp from "./pages/TodoApp";
import LoginPage from "./pages/LoginPage";
import SignUp    from "./pages/SignupPage";
import "./App.css";

const App = () => {
  const [user, setUser] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
      <BrowserRouter>
        <Routes>
          {/* root and /login both need to receive setOwner */}
          <Route
            path="/"
            element={<LoginPage setOwner={setUser} />}
          />
          <Route
            path="/login"
            element={<LoginPage setOwner={setUser} />}
          />
          <Route
            path="/signup"
            element={<SignUp />}
          />
          <Route
            path="/todoapp"
            element={
              // protect this route if no user, or redirect to login
              user
                ? <TodoApp owner={user} />
                : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
