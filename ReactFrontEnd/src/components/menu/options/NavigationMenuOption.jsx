import { useTranslation } from "react-i18next";
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
import { useAuth } from "../../../utils/contexts/AuthContext";

export const getNavigationMenu = () => {
    const { t: Traduction } = useTranslation();
    const { userRole } = useAuth();

    const allMenuItems = [
        { key: "menu.menu", icon: faSchool, link: "#" },
        { key: "menu.dashboard", icon: faGauge, link: "/YLSchool/DashBoard" },
        { key: "menu.students", icon: faUserGraduate, link: "/YLSchool/Etudiants" },
        { key: "menu.anneescolaire", icon: faCalendarDays, link: "/YLSchool/AnneeScolaire" },
        { key: "menu.teachers", icon: faChalkboardTeacher, link: "/YLSchool/Professeurs" },
        { key: "menu.subjects", icon: faBookOpen, link: "/YLSchool/Matiere" },
        { key: "menu.levels", icon: faLayerGroup, link: "/YLSchool/Niveaux" },
        { key: "menu.rooms", icon: faDoorOpen, link: "/YLSchool/Salles" },
        { key: "menu.groups", icon: faUsers, link: "/YLSchool/Groupes" },
        { key: "menu.evaluations", icon: faClipboardCheck, link: "/YLSchool/Evaluations" },
        { key: "menu.timetable", icon: faClock, link: "/YLSchool/TimeTables" }
    ];

    const roleAccess = {
        admin: [
            "menu.menu", "menu.dashboard", "menu.students", "menu.anneescolaire",
            "menu.teachers", "menu.subjects", "menu.levels", "menu.rooms",
            "menu.groups", "menu.evaluations", "menu.timetable"
        ],
        etudiant: [
            "menu.menu", "menu.dashboard", "menu.subjects", "menu.evaluations", "menu.timetable"
        ],
        professeur: [
            "menu.menu", "menu.dashboard", "menu.students", "menu.groups", 
            "menu.evaluations", "menu.timetable"
        ]
    };

    const allowedKeys = roleAccess[userRole] || [];

    const filteredMenuItems = allMenuItems
        .filter(item => allowedKeys.includes(item.key))
        .map(item => ({
            text: Traduction(item.key),
            icon: item.icon,
            link: item.link
        }));

    return { menuItems: filteredMenuItems };
};
