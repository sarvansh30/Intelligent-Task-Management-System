import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Header() {
  const user = localStorage.getItem("username");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // remove auth data
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setMenuOpen(false);
    // send them back to login
    navigate("/login");
  };

  return (
    <header className="py-6">
      <div className="flex items-center justify-center relative">
        {/* Brand Name - Centered */}
        <div className="flex items-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] rounded-lg blur opacity-25"></div>
            <h1 className="relative font-bold tracking-tight text-center flex items-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 text-6xl font-['Poppins']">
                What <span className="text-white italic font-black">Todo</span>?
              </span>
              {/* User Profile - Adjacent to question mark */}
              <div className="ml-1">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="group flex items-center gap-2 bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] p-2 pl-4 pr-3 rounded-xl hover:bg-[var(--color-bg-tertiary)] transition-all duration-200"
                >
                  {/* User Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] flex items-center justify-center text-white font-bold">
                    {user?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  
                  <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors duration-200">
                    {user}
                  </span>
                  
                  <svg 
                    className={`h-4 w-4 text-[var(--color-text-tertiary)] transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`
                    absolute mt-2 w-48 p-2
                    bg-[var(--color-bg-secondary)] rounded-xl shadow-lg border border-[var(--color-bg-tertiary)]
                    transition-all duration-200 origin-top-right z-10
                    ${menuOpen 
                      ? "opacity-100 scale-100 translate-y-0" 
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
                  `}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
