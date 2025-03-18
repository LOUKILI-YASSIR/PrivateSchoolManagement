import MenuCart from "./CartMenu.jsx";
import {getMenu} from "./options/TopMenuOption.jsx";
import { useMenuTop } from "./hooks/useTopMenu.jsx";
import { faBars, faCalendarDays } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function MenuTop ({content}) {
  const {userMenuItems} = getMenu();
  const {
    handleToggleClick,
    Language,isToggleActive,Dispatch,
    Traduction
  } = useMenuTop();
  return (
    <div className="main absolute min-h-screen h-auto w-[calc(100%-300px)] left-[300px] bg-gray-300">
      <div className="topbar w-full h-15 flex justify-between items-center px-2.5">
        <div className="search relative w-full mx-2.5 mt-2.5 flex items-center justify-between">
          <div className="w-full h-15 flex justify-between items-center px-2.5">
            <div
              className={`toggle relative w-15 h-15 flex justify-center items-center text-3xl cursor-pointer ${
                isToggleActive ? "active" : "desactive"
              }`}
              onClick={()=>handleToggleClick(Dispatch)}
            >
              <FontAwesomeIcon icon={faBars}/>
            </div>
            <div>
            <span className="text-lg pl-4 pr-2" id="date"></span>
            <FontAwesomeIcon className="pr-2 text-xl" icon={faCalendarDays}/>
            </div>
            <MenuCart
              menuItems={["fr","en","es","de"]}
              menuContent={
                <img 
                  src={`/Locales/${Language}.png`} 
                  alt={Language} 
                  className="w-10 my-1"
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
                  className="cursor-pointer rounded-full w-10 h-10 object-cover"
                  src="/images/profile-default.png"
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
      {content}
    </div>
  );
};
