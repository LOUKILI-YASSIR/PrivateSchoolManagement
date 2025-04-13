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
    faClock,
    faLayerGroup,
    faClipboardCheck
 } from "@fortawesome/free-solid-svg-icons";

export const getNavigationMenu = (tableName) => {
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
                text: Traduction("menu.anneescolaire"),
                icon: faCalendarDays,
                link: "/YLSchool/AnneeScolaire", 
            },
            { 
                text: Traduction("menu.teachers"), 
                icon: faChalkboardTeacher, 
                link: "/YLSchool/Professeurs",
            },
            { 
                text: Traduction("menu.subjects"), 
                icon: faBookOpen, 
                link: "/YLSchool/Matiere",
            },
            { 
                text: Traduction("menu.levels"), 
                icon: faLayerGroup, 
                link: "/YLSchool/Niveaux",
            },      
            { 
                text: Traduction("menu.rooms"), 
                icon: faDoorOpen, 
                link: "/YLSchool/Salles",
            },
            { 
                text: Traduction("menu.groups"), 
                icon: faUsers, 
                link: "/YLSchool/Groupes",
            },
            { 
                text: Traduction("menu.evaluations"), 
                icon: faClipboardCheck, 
                link: "/YLSchool/Evaluations",
            },
            { 
                text: Traduction("menu.timetable"), 
                icon: faClock, 
                link: "/YLSchool/TimeTables",
            }
        ],     
    }
}

