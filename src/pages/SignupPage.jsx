import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserSignUp } from "../APIs/auth_API_calls";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPass, setReEnterPass] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  
  const navigate = useNavigate();

  // auto-clear notifications
  useEffect(() => {
    if (!notification.message) return;
    const timer = setTimeout(() => setNotification({ message: "", type: "" }), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== reEnterPass) {
      setNotification({ message: "Passwords do not match", type: "error" });
      return;
    }
    
    try {
      await UserSignUp(username, password);
      setNotification({ message: "Account created successfully! Redirecting to login...", type: "success" });
      
      // Delay navigation to show success message
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      const msg = (err.response && err.response.data && err.response.data.detail) 
        ? err.response.data.detail 
        : err.message || "Signup failed. Please try again.";
      setNotification({ message: msg, type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
      <div className="w-full max-w-md bg-[var(--color-bg-tertiary)] rounded-2xl shadow-[var(--shadow-lg)] p-8 space-y-6 relative overflow-hidden backdrop-blur-sm border border-opacity-20 border-white/10">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--color-accent-secondary)] opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[var(--color-accent-primary)] opacity-30 rounded-full blur-3xl"></div>
        
        <h2 className="text-center text-4xl font-bold text-[var(--color-text-primary)] font-['Poppins']">
          Create Account
        </h2>
        <p className="text-center text-[var(--color-text-secondary)] -mt-2">Join us today and organize your tasks</p>

        {notification.message && (
          <div
            className={`px-4 py-3 rounded-lg text-sm font-medium border-l-4 shadow-md animate-fade-in-down transition-all duration-300 ${
              notification.type === "error" 
                ? "bg-red-900/30 text-red-200 border-red-500" 
                : "bg-green-900/30 text-green-200 border-green-500"
            }`}
          >
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] px-4 py-3 rounded-xl 
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] 
                  focus:bg-[var(--color-bg-secondary)] transition-all duration-200 border border-[var(--color-bg-tertiary)]"
                placeholder="Choose a username"
                required
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-3.5 h-5 w-5 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] px-4 py-3 rounded-xl 
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] 
                  focus:bg-[var(--color-bg-secondary)] transition-all duration-200 border border-[var(--color-bg-tertiary)]"
                placeholder="Create a strong password"
                required
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-3.5 h-5 w-5 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <div>
            <label htmlFor="re-enter" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="re-enter"
                type="password"
                value={reEnterPass}
                onChange={(e) => setReEnterPass(e.target.value)}
                className="w-full bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] px-4 py-3 rounded-xl 
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] 
                  focus:bg-[var(--color-bg-secondary)] transition-all duration-200 border border-[var(--color-bg-tertiary)]"
                placeholder="Re-enter your password"
                required
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-3.5 h-5 w-5 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] 
              hover:from-[var(--color-accent-secondary)] hover:to-[var(--color-accent-primary)] 
              text-white py-3 px-4 rounded-xl transition-all duration-300 font-medium
              shadow-lg shadow-[var(--color-accent-primary)]/20"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-[var(--color-text-secondary)] text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-accent-secondary)] hover:text-[var(--color-accent-tertiary)] transition-colors duration-200 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;