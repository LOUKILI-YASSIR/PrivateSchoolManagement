import { Link } from "react-router-dom";
import { getNavigationMenu } from "./options/NavigationMenuOption.jsx";
import { useMenuNavigation } from "./hooks/useNavigationMenu.jsx";
import { Fragment, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

export default function MenuNavigation() {
  const {
    hoveredLink,myFileName,dispatch,
    handleHover,handleMouseLeave,
    isToggleActive
  } = useMenuNavigation();
  const {layoutOptions,menuItems} = getNavigationMenu();
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
  
  // Add dynamic class to navigation based on dark mode
  useEffect(() => {
    const navigation = document.querySelector(".navigation");
    if (navigation) {
      if (isDarkMode) {
        navigation.classList.remove('light-mode');
        navigation.classList.add('dark-mode');
      } else {
        navigation.classList.remove('dark-mode');
        navigation.classList.add('light-mode');
      }
    }
  }, [isDarkMode]);

  return (
    <div 
      className={`navigation ${isDarkMode ? 'dark-mode' : 'light-mode'} transition-all duration-300 ease-in-out ${
        isToggleActive ? 'translate-x-[-9px] opacity-100' : '-translate-x-[9px] opacity-100'
      }`} 
      id="menu"
    >
      <ul onMouseDown={(e) => e.preventDefault()}>  
        {menuItems.map((item, index) => (
          <Fragment key={index}>
            <li
              className={`li_${index + 1} ${index === 0 ? "text-lg" : ""} ${
                hoveredLink === item.link ? "shadow" : ""
              } ${item.link !== "#" && item.link === `${myFileName}` ? "activePage hoveredwhite" : ""} transition-all duration-200`}
              style={{lineHeight:"10px"}}
              onMouseEnter={() =>item.link !== "#" && item.link === `${myFileName}` ? handleHover(item.link): null}
              onMouseLeave={()=>handleMouseLeave()}
            >
              <Link
                to={item.link}
                title={document.querySelector('.navigation.active') && item.link !== '#' ? item.text : ''} // Show title only when collapsed and not the toggle
              >
                <span className="icon">
                  <FontAwesomeIcon 
                    icon={item.icon} 
                    className={`${index === 0 ? "cursor-pointer" : ""} transition-all duration-300`}
                  />
                </span>
                <span className="title transition-all duration-200">
                  {item.text}
                </span>
              </Link>
            </li>
            {index === 0 && <hr className={`w-11/12 ${isDarkMode ? 'border-gray-700' : ''}`} />} 
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
