import MenuCart from "./CartMenu.jsx";
import {getMenu} from "./options/TopMenuOption.jsx";
import { useMenuTop } from "./hooks/useTopMenu.jsx";
import { faBars, faCalendarDays, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DarkModeToggle from "../common/DarkModeToggle";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../Store/Slices/ThemeSlice.jsx";
import { useEffect } from "react";
import DateWithCalendar from "../common/DateWithCalendar.jsx";
import { useAuth } from "../../utils/contexts/AuthContext.jsx";

export default function MenuTop ({content}) {
  const { logout } = useAuth();
  const {userMenuItems} = getMenu(()=>logout());
  const {
    handleToggleClick,
    Language,isToggleActive,Dispatch,
    Traduction
  } = useMenuTop();
  
  // Dark mode from Redux
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
  const dispatch = useDispatch();
  
  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };
  
  // Add the CSS for rotating animation
  useEffect(() => {
    let styleEl = document.getElementById('toggle-rotation-animation');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'toggle-rotation-animation';
      document.head.appendChild(styleEl);
      
      styleEl.innerHTML = `
        @keyframes revolve {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .toggle-revolve {
          animation: revolve 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .toggle-revolve-reverse {
          animation: revolve 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) reverse;
        }
      `;
    }
    
    return () => {
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, []);
  
  // Handle the toggle click with animation
  const handleToggleWithAnimation = () => {
    const toggle = document.querySelector(".toggle");
    if (toggle) {
      // Remove previous classes
      toggle.classList.remove("toggle-revolve", "toggle-revolve-reverse");
      
      // Force a reflow (repaint) to restart animation
      void toggle.offsetWidth;
      
      // Add the appropriate animation class
      if (isToggleActive) {
        toggle.classList.add("toggle-revolve-reverse");
      } else {
        toggle.classList.add("toggle-revolve");
      }
    }
    
    // Call the original toggle handler
    handleToggleClick(Dispatch);
  };
  
  return (
    <div className={`main absolute min-h-screen h-auto w-[calc(100%-300px)] left-[300px] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-800'} transition-all duration-300 ease-in-out`}>
      <div className="topbar w-full h-15 flex justify-between items-center px-2.5">
        <div className="search relative w-full mx-2.5 mt-2.5 flex items-center justify-between">
          <div className="w-full h-15 flex justify-between items-center px-2.5">
            <div
              className={`toggle relative w-12 h-12 flex justify-center items-center text-3xl cursor-pointer overflow-hidden rounded-full transition-all duration-300 ease-in-out ${
                isToggleActive ? "active bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              } ${isDarkMode ? "text-white bg-gray-700 hover:bg-gray-500 hover:text-" : "text-gray-800 hover:bg-gray-600 hover:text-white"}`}
              onClick={handleToggleWithAnimation}
            >
              <FontAwesomeIcon 
                icon={faBars}
                className={`transition-all duration-300 ease-in-out ${isToggleActive ? "scale-110" : ""}`}
              />
              <span className={`absolute inset-0 bg-blue-500 rounded-full scale-0 transition-transform duration-300 ease-in-out ${
                isToggleActive ? "scale-100 opacity-10" : "opacity-0"
              }`}></span>
            </div>

            {/* Date */}
            <DateWithCalendar/>
            
            {/* Dark Mode Toggle */}
            <div className="mx-2">
              <DarkModeToggle
                isDarkMode={isDarkMode}
                toggleDarkMode={handleToggleDarkMode}
              />
            </div>
            
            <MenuCart
              menuItems={["fr","en","es","de"]}
              menuContent={
                <img 
                  src={`/Locales/${Language}.png`} 
                  alt={Language} 
                  className="w-10 my-1 transition-transform duration-200 hover:scale-110"
                />
              }
              menuPositionActive={{ x: 230, y: -5 }}
              menuPositionNotActive={{ x: 450, y: 0 }}
              menuType="language"
            />
            <MenuCart
              menuItems={userMenuItems}
              menuContent={
                <img
                  className="my-1 cursor-pointer rounded-full w-10 h-10 object-cover transition-transform duration-200 hover:scale-110"
                  src="/uploads/default.jpg"
                  alt="User"

                />
              }
              menuPositionActive={{ x: 290, y: 5 }}
              menuPositionNotActive={{ x: 510, y: 0 }}
              menuType="user"
            />
          </div>
        </div>
      </div>
      <div className={`content-container mx-4 my-4 p-6 px-3 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} transition-all duration-300 ease-in-out`}>
        {content}
      </div>
    </div>
  );
};
