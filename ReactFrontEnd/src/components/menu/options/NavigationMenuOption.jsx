 import { useTranslation } from "react-i18next"
import { 
    faSchool, faTableList, faGraduationCap,  faUserGroup, faCreditCard, faBookOpenReader,
    faClipboardList, faClipboard, faBorderNone, faUserGraduate, faCircleInfo
 } from "@fortawesome/free-solid-svg-icons";

 export const getNavigationMenu = () => {
    const {t:Traduction} = useTranslation()
    return { 
        menuItems : [
            { 
                text: Traduction("menu.menu"),
                icon: faSchool, 
                link: "#",
            },
            { 
                text: Traduction("menu.dashboard"), 
                icon: faTableList, 
                link: "/YLSchool",
            },
            { 
                text: Traduction("menu.students"), 
                icon: faGraduationCap, 
                link: "/YLSchool/Etudiants",
            },
            { 
                text: Traduction("menu.teachers"), 
                icon: faUserGroup, 
                link: "/YLSchool/Professeurs",
            },
            { 
                text: Traduction("menu.tuition"), 
                icon: faCreditCard, 
                link: "#",
            },
            { 
                text: Traduction("menu.courses"), 
                icon: faBookOpenReader, 
                link: "#",
            },
            { 
                text: Traduction("menu.attendance"), 
                icon: faClipboardList, 
                link: "#",
            },
            { 
                text: Traduction("menu.grades"), 
                icon: faClipboard, 
                link: "#",
            },
            { 
                text: Traduction("menu.rooms"), 
                icon: faBorderNone, 
                link: "#",
            },
            { 
                text: Traduction("menu.classes"), 
                icon: faUserGraduate, 
                link: "#",
            },
            { 
                text: Traduction("menu.timetable"), 
                icon: faCircleInfo, 
                link: "#",
            }
        ],    
    }
}

