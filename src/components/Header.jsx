import { useState } from "react";
import "./style.css";

function Header() {
  const user = localStorage.getItem("username");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 text-white relative">
      {/* Brand Name */}
      <div className="leading-tight">
        <div className="font-extrabold tracking-tight text-7xl pt-3.5">
          What <span className="text-green-400 italic">ToDo?</span>

          {/* Username + Toggle */}
          <div className="inline-block relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="ml-2 focus:outline-none">
              <span className="transition-all duration-500 text-gray-400 pl-3 text-3xl hover:text-cyan-300 hover:cursor-pointer">
                {user}
              </span>
            </button>

            {/* Slide-out Menu */}
            <nav
              className={`absolute top-5/7 left-full transform -translate-y-1/2 ml-3 border-1 border-gray-50 text-gray-50 shadow-lg rounded-full px-4 py-2 transition-all duration-500 ${
                menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none'
              }`}
            >
              <ul>
                <li className= "tracking-normal font-medium text-gray-400 text-sm cursor-pointer hover:text-cyan-300">logout</li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
