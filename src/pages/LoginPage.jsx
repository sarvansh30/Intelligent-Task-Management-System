import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../APIs/auth_API_calls";

const LoginPage = ({ setOwner }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  // auto-clear notifications
  useEffect(() => {
    if (!notification.message) return;
    const timer = setTimeout(() => setNotification({ message: "", type: "" }), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      if (data.access_token) {
        setOwner(username);
        navigate("/todoapp");
      }
    } catch (err) {
      const msg = (err.response && err.response.data && err.response.data.detail) 
        ? err.response.data.detail 
        : err.message || "Login failed.";
      setNotification({ message: msg, type: "error" });
    } finally {
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-6">
      <div className="w-full max-w-md bg-zinc-800 rounded-2xl shadow-md p-8 space-y-6">
        <h2 className="text-center text-3xl font-bold text-white">Login</h2>

        {notification.message && (
          <div
            className={`px-4 py-3 rounded-lg text-sm font-medium border-l-4 shadow-md animate-fade-in-down transition-opacity duration-300
              ${notification.type === "error" 
                ? "bg-red-100 text-red-800 border-red-500" 
                : "bg-green-100 text-green-800 border-green-500"}`}
          >
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-200">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition duration-200"
          >
            Enter
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-green-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;