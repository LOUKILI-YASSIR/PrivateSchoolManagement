import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useActionsCart } from "./hooks/useCartMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import './styles/CartMenu.css';
import { Link, useNavigate } from "react-router-dom";

const MenuCart = ({ menuItems, menuContent, menuType, maxHeight, title, margin }) => {
  const {
    LanguageChange, open, anchorEl, itemRefs,
    handleClick, handleClose, handleMouseEnter, handleMouseLeave,
    getTextContent
  } = useActionsCart();
  
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return;
      
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = itemRefs.current.findIndex(ref => ref === document.activeElement);
        const direction = e.key === 'ArrowDown' ? 1 : -1;
        const nextIndex = (currentIndex + direction + menuItems.length) % menuItems.length;
        itemRefs.current[nextIndex]?.focus();
      }
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, itemRefs, menuItems.length, handleClose]);

  // Complete styling objects for menu components
  const menuStyles = {
    paper: {
      backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : '#ffffff',
      color: isDarkMode ? '#e0e0e0' : 'inherit',
      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      boxShadow: isDarkMode 
        ? '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
      padding: '8px 0',
      overflow: 'hidden',
      maxHeight: maxHeight || 'none',
    }
  };

  const buttonStyles = {
    padding: '8px 16px',
    minWidth: 'auto',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    textTransform: 'none',
    fontWeight: 500,
    backgroundColor: open 
      ? (isDarkMode ? 'rgba(55, 65, 81, 0.9)' : '#e9ecef')
      : (isDarkMode ? 'rgba(30, 41, 59, 0.8)' : '#f8f9fa'),
    color: isDarkMode ? '#e0e0e0' : '#333',
    border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: open ? 'none' : (isDarkMode ? '0 2px 5px rgba(0, 0, 0, 0.2)' : '0 2px 5px rgba(0, 0, 0, 0.05)'),
    '&:hover': {
      backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.9)' : '#e9ecef',
      transform: 'translateY(-2px)',
      boxShadow: isDarkMode ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: 'none',
    },
    '&.active': {
      backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.9)' : '#e9ecef',
    }
  };

  const menuItemStyles = (index, isLanguage = false) => ({
    padding: "10px 16px",
    margin: "4px 8px",
    borderRadius: "8px",
    backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.4)' : '#ffffff',
    color: isDarkMode ? '#e0e0e0' : '#333',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.95rem',
    fontWeight: isLanguage ? 500 : 400,
    '&:hover': {
      backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.9)' : '#f1f5f9',
      transform: 'translateX(4px)',
    },
    '&:focus': {
      backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.9)' : '#f1f5f9',
      outline: 'none',
    },
    '&:not(:hover):not(:focus)': {
      backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.4)' : '#ffffff',
      color: isDarkMode ? '#e0e0e0' : '#333',
    },
    '&.Mui-selected': {
      backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
      color: isDarkMode ? '#90caf9' : '#1976d2',
      '&:hover': {
        backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
      }
    }
  });
  
  const iconStyles = {
    color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#333',
    fontSize: '1.1rem',
    marginRight: '8px',
    transition: 'transform 0.2s ease',
    opacity: 0.8
  };

  const titleStyles = {
    padding: "8px 16px",
    fontSize: "0.8rem",
    fontWeight: 600,
    textTransform: "uppercase",
    color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
    letterSpacing: "0.05em"
  };

  const dividerStyle = {
    margin: '8px 0',
    height: '1px',
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    border: 'none',
    width: '100%'
  };

  const isLanguageItem = (item) => typeof item === 'string' && ["fr", "en", "es", "de"].includes(item);

  // Group items by type
  const groupItems = () => {
    const languageItems = menuItems.filter(item => isLanguageItem(item));
    const otherItems = menuItems.filter(item => !isLanguageItem(item));
    
    return { languageItems, otherItems, hasMultipleGroups: languageItems.length > 0 && otherItems.length > 0 };
  };

  const { languageItems, otherItems, hasMultipleGroups } = groupItems();
  
  return (
    <div id={menuType} className={`cart-menu-container ${isDarkMode ? 'dark-mode' : 'light-mode'} ${open ? 'active' : ''}`}>
      <Button
        id={`${menuType}-menu-button`}
        aria-controls={open ? `${menuType}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(e) => handleClick(e, menuType)}
        className={`cart-menu-button ${open ? "active" : ""}`}
        sx={{
          ...buttonStyles, 
          '&::after': open ? {
            content: '""',
            position: 'absolute',
            bottom: -2,
            left: '50%', 
            transform: 'translateX(-50%)',
            width: '8px',
            height: '8px',
            backgroundColor: isDarkMode ? '#e0e0e0' : '#333',
            borderRadius: '50%',
          } : {}
        }}
      >
        {menuContent}
      </Button>
      <Menu
        ref={menuRef}
        id={`${menuType}-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        disableScrollLock
        transitionDuration={200}
        PaperProps={{
          elevation: 3,
          className: "cart-menu-paper",
          sx: {
            ...menuStyles.paper,
            margin,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -8,
              left: 20,
              width: 16,
              height: 16,
              transform: 'rotate(45deg)',
              backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : '#ffffff',
              borderLeft: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              borderTop: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              zIndex: 0,
            }
          }
        }}
        MenuListProps={{
          style: {
            padding: '8px 0',
          },
          'aria-labelledby': `${menuType}-menu-button`
        }}
        className="cart-menu"
      >
        {title && <div style={titleStyles}>{title}</div>}
        
        {otherItems.length > 0 && otherItems.map((item, index) => (
          <MenuItem
            key={`other-${index}`}
            onClick={() => {
              
              if (item.link && item.link !== "#") {
                navigate(item.link);
              } else if (item.handleClick) {
                item.handleClick();
              }
              handleClose();
            }}
            ref={(el) => (itemRefs.current[index] = el)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            sx={menuItemStyles(index)}
            className={`cart-menu-item ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
            selected={false}
            tabIndex={0}
          >
            {item.icon && (
              <div className="menu-icon-wrapper" style={{ minWidth: '32px' }}>
                <FontAwesomeIcon 
                  icon={item.icon} 
                  style={iconStyles} 
                  className="cart-menu-icon"
                />
              </div>
            )}
            <div style={{ 
              color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#333',
              fontWeight: 500, 
              flex: 1
            }}>
              {getTextContent(item)}
            </div>
          </MenuItem>
        ))}
        
        {hasMultipleGroups && <hr style={dividerStyle} />}
        
        {languageItems.length > 0 && languageItems.map((item, index) => (
          <MenuItem
            key={`lang-${index}`}
            onClick={() => {
              ["fr", "en", "es", "de"].includes(item) && LanguageChange(item);
              handleClose();
            }}
            ref={(el) => (itemRefs.current[otherItems.length + index] = el)}
            onMouseEnter={() => handleMouseEnter(otherItems.length + index)}
            onMouseLeave={() => handleMouseLeave(otherItems.length + index)}
            sx={menuItemStyles(index, true)}
            className="cart-menu-item language-item"
            selected={false}
            tabIndex={0}
          >
            <div className="language-flag-container">
              <img 
                src={`/Locales/${item}.png`} 
                alt={item} 
                className="language-flag"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: '12px',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
              />
            </div>
            <span style={{color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#333'}}>{getTextContent(item)}</span>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default MenuCart;