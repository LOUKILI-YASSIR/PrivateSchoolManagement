import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const HandleCart = ({setAnchorEl,itemRefs}) =>{
    const handleClick = (event,menuType) => {
        setAnchorEl(event.currentTarget);
        if(menuType.includes("navtype")) document.querySelector(`#navtype i`)?.classList?.add("active");
        else document.querySelector(`#navtype i`)?.classList?.remove("active");
    };
    const handleClose = () => {
        document.querySelector(`#navtype i`)?.classList?.remove("active");
        setAnchorEl(null);
    };
    const handleMouseEnter = (index) => {
      const currentItem = itemRefs.current[index];
      if (currentItem) {
        currentItem.style.backgroundColor = "#1E3A8A";
        currentItem.style.color = "#ffffff";
      } 
    };
    const handleMouseLeave = (index) => {
      const currentItem = itemRefs.current[index];
      if (currentItem) {
        currentItem.style.backgroundColor = "#ffffff";
        currentItem.style.color = "#000000";
      }
    };
    const {t:Traduction,i18n} = useTranslation()

    const LanguageChange = (Language) => {
      i18n.changeLanguage(Language)
    }
    const getTextContent = (item)=>{
      const key = item.icon ? "menu" : "Languages";
      const value = typeof item === "object" ? item.text : item;
      return Traduction(`${key}.${value}`);
    }
    return {handleClick,handleClose,handleMouseEnter,handleMouseLeave,LanguageChange,getTextContent}
}

export const useActionsCart = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const itemRefs = useRef([]);
  const open = Boolean(anchorEl);

  return {...HandleCart({setAnchorEl,itemRefs,dispatch}),anchorEl,open,itemRefs}
}
