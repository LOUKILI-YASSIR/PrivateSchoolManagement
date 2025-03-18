import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useActionsCart } from "./hooks/useCartMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const MenuCart = ({ menuItems, menuContent, menuType }) => {
  const {
    LanguageChange,open,anchorEl,itemRefs,
    handleClick,handleClose,handleMouseEnter,handleMouseLeave,
    getTextContent
  } = useActionsCart()
  return (
    <div id={menuType}>
      <Button
        id={`${menuType}-menu-button`}
        aria-controls={open ? `${menuType}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(e)=>handleClick(e,menuType)}
        className={`text-black hover:rounded-full p-0 icon hover:bg-gray-300 ${open ? "active": ""}`}
      >
        {menuContent}
      </Button>
      <Menu
        id={`${menuType}-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        disableScrollLock
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              ["fr","en","es","de"].includes(item) && LanguageChange(item)
              handleClose();
            }}
            ref={(el) => (itemRefs.current[index] = el)} // Assign ref to the current menu item
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            style={{padding:"10px 20px",margin:"0 10px",borderRadius:"5px"}}
          >
            <span className="mr-2"> 
              {
                item.icon ?
                  <FontAwesomeIcon icon={item.icon}/>
                  :                 
                  <img 
                    src={`/Locales/${item}.png`} 
                    alt={item} 
                    className="w-6"
                  />
              }
            </span>
            <span>{
              getTextContent(item)
            }</span>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default MenuCart;
