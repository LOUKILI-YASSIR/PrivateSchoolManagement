import { Link } from "react-router-dom";
import { getNavigationMenu } from "./options/NavigationMenuOption.jsx";
import { useMenuNavigation } from "./hooks/useNavigationMenu.jsx";
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MenuNavigation() {
  const {
    hoveredLink,myFileName,dispatch,
    handleHover,handleMouseLeave
  } = useMenuNavigation();
  const {layoutOptions,menuItems} = getNavigationMenu();

  return (
    <div className="navigation" id="menu">
      <ul onMouseDown={(e) => e.preventDefault()}>  
        {menuItems.map((item, index) => (
          <Fragment key={index}>
            <li
              className={`li_${index + 1} ${index === 0 ? "text-lg" : ""} ${
                hoveredLink === item.link ? "shadow" : ""
              } ${item.link !== "#" && item.link === `${myFileName}` ? "activePage hoveredwhite" : ""}`}
              style={{lineHeight:"10px"}}
              onMouseEnter={() =>item.link !== "#" && item.link === `${myFileName}` ? handleHover(item.link): null}
              onMouseLeave={()=>handleMouseLeave()}
            >
              <Link
                to={item.link} 
              >
                <span className="icon">
                  <FontAwesomeIcon icon={item.icon} className={index===0 ? "cursor-pointer" : ""}/>
                </span>
                <span className="title">{item.text}</span>
              </Link>
            </li>
            {index === 0 && <hr className="w-11/12" />} 
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
