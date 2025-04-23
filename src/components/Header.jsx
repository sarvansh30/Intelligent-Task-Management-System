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
    <div className="flex items-center gap-3 text-white relative justify-center">
      {/* Brand Name */}
      <div className="leading-tight">
        <div className="font-extrabold tracking-normal text-7xl pt-3.5">
          What <span className="text-green-400 italic">ToDo?</span>

          {/* Username + Toggle */}
          <div className="inline-block relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="ml-2 focus:outline-none"
            >
              <span className="transition-all duration-500 text-gray-400 pl-3 text-3xl hover:text-cyan-300">
                {user}
              </span>
            </button>

            {/* Slide-out Menu */}
            <nav
              className={`
                absolute top-1/2 left-full transform -translate-y-1/2 ml-3
                bg-zinc-800 border border-gray-700 text-gray-100
                shadow-lg rounded-md px-4 py-2 transition-all duration-300
                ${menuOpen 
                  ? "opacity-100 translate-x-0 pointer-events-auto" 
                  : "opacity-0 -translate-x-3 pointer-events-none"}
              `}
            >
              <ul>
                <li
                  onClick={handleLogout}
                  className="
                    tracking-normal font-medium text-gray-200 text-sm 
                    cursor-pointer hover:text-cyan-300 py-1
                  "
                >
                  Logout
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
