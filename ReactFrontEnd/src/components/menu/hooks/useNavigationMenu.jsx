import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
export const useMenuNavigation = () => {
    const [hoveredLink, setHoveredLink] = useState(null);
    const myFileName = useLocation().pathname;
    const {i18n} = useTranslation();
    const dispatch = useDispatch()
    const handleHover = (link) => setHoveredLink(link);
    const handleMouseLeave = () => setHoveredLink(null);
    useEffect(() => {
      const menuBlock = document.querySelector(".navigation");

      menuBlock.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        menuBlock.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, [ i18n ]);
    return {
        hoveredLink,myFileName,dispatch,
        handleHover,handleMouseLeave
    }
}
