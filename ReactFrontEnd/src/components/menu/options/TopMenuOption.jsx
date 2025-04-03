import { faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons"
// Show Text Lists
export const getMenu = (handleLogout) => {
    return {
        userMenuItems:[
            {
                text: "viewProfile",
                icon: faUser,
                link: "/YLSchool/Profile",
            },
            {
                text: "logOut",
                icon: faPowerOff,
                handleClick: () => {
                    handleLogout();
                }
            },
        ],
    }
}
