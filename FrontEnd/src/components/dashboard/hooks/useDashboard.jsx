import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const useDashboard = () => {
    const {i18n:Language} = useTranslation()
    const isToggleActive = useSelector((state) => state.Menu.MenuActive);
    useEffect(() => {
        setTimeout(() => {
            const descriptions = document.querySelectorAll(".description");
            descriptions.forEach((desc) => {
                if(Language==="es") desc.style.fontSize = isToggleActive ? "16px" : "12.5px";
                else desc.style.fontSize = isToggleActive ? "20px" : "15px";
            });
        }, isToggleActive ? 1000 : 200);
    }, [isToggleActive]);
    return {
        Language,isToggleActive
    }
}