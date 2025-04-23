import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserSignUp } from "../APIs/auth_API_calls";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPass, setReEnterPass] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await UserSignUp(username, password);
    setUsername("");
    setPassword("");
    setReEnterPass("");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-6">
      <div className="w-full max-w-md bg-zinc-800 rounded-2xl shadow-md p-8 space-y-6">
        <h2 className="text-center text-3xl font-bold text-white">Sign Up</h2>
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

          <div>
            <label htmlFor="re-enter" className="block text-sm font-medium text-gray-200">
              Re-enter Password
            </label>
            <input
              id="re-enter"
              type="password"
              value={reEnterPass}
              onChange={(e) => setReEnterPass(e.target.value)}
              className="mt-1 w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition duration-200"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;