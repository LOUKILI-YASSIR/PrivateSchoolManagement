import { useEffect } from "react";
import { changeViewMenu } from "../../../store/slices/MenuSlice.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
// Toggle Menu Active/NotActive
export const useMenuTop = () => {
    const handleToggleClick = (setIsToggleActive) => {
        setIsToggleActive(changeViewMenu({MenuType:"active"}));
        const navigation = document.querySelector(".navigation");
        const hr = document.querySelector("hr");
        const main = document.querySelector(".main");
        if (navigation) navigation.classList.toggle("active");
        if (hr) hr.classList.toggle("active");
        if(main) main.classList.toggle("active");
    };
      const isToggleActive = useSelector((state) => state.Menu.MenuActive);
      const Dispatch = useDispatch();
    useEffect(() => {
      const now = new Date();
      const formattedDate = [
        String(now.getDate()).padStart(2, "0"),
        String(now.getMonth() + 1).padStart(2, "0"),
        now.getFullYear(),
      ].join("/");
      const dateElement = document.getElementById("date");
      if (dateElement) dateElement.innerHTML = `<span className="text-blue-900 mr-5">${formattedDate}</span>`;
    }, []);
    const {i18n} = useTranslation()
    return {
      handleToggleClick,
      isToggleActive,Dispatch,
      Language:i18n.language
    }
}
