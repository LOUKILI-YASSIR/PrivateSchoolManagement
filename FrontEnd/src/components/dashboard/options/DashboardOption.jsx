import { useTranslation } from "react-i18next";
import { faUsers, faMale, faFemale, faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons"
const getCards = () => {
    const {t:Traduction} = useTranslation()
    return [
        {
            name: Traduction("dashboard.students"),
            description: Traduction("dashboard.desc_students"),
            color: "yellow",
            icon: faUsers,
            ClassIcon: "users",
            count: 0
        },
        {
            name: Traduction("dashboard.boys"),
            description: Traduction("dashboard.desc_boys"),
            color: "green",
            icon: faMale,
            ClassIcon:"male",
            count: 0
        },
        {
            name: Traduction("dashboard.girls"),
            description: Traduction("dashboard.desc_girls"),
            color: "red",
            icon: faFemale,
            ClassIcon:"female",
            count: 0
        },
        {
            name: Traduction("dashboard.class"),
            description: Traduction("dashboard.desc_class"),
            color: "blue",
            icon: faChalkboardTeacher,
            ClassIcon:"chalkboard-teacher",
            count: 0
        }
    ];
};

export { getCards };
