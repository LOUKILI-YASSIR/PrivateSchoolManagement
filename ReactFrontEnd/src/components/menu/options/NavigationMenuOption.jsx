 import { useTranslation } from "react-i18next"
import { 
    faSchool, 
    faUserGraduate,
    faGauge,
    faChalkboardTeacher,
    faBookOpen,
    faDoorOpen,
    faUsers,
    faCalendarDays,
    faClock
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
                icon: faGauge, 
                link: "/YLSchool/DashBoard",
            },
            { 
                text: Traduction("menu.students"), 
                icon: faUserGraduate, 
                link: "/YLSchool/Etudiants",
            },
            { 
                text: Traduction("menu.teachers"), 
                icon: faChalkboardTeacher, 
                link: "/YLSchool/Professeurs",
            },
            { 
                text: Traduction("menu.subjects"), 
                icon: faBookOpen, 
                link: "/YLSchool/Matieres",
            },      
            { 
                text: Traduction("menu.rooms"), 
                icon: faDoorOpen, 
                link: "/YLSchool/Salles",
            },
            { 
                text: Traduction("menu.groups"), 
                icon: faUsers, 
                link: "/YLSchool/Groups",
            },
            { 
                text: Traduction("menu.period"), 
                icon: faCalendarDays, 
                link: "/YLSchool/Periodes",
            },
            { 
                text: Traduction("menu.timetable"), 
                icon: faClock, 
                link: "/YLSchool/EmploisDuTemps",
            }
        ],     
    }
}

