import { faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons"

// Show Text Lists
export const getMenu = () => {
    return {
        userMenuItems:[
            {
                text: "viewProfile",
                icon: faUser,
                link: "#",
            },
            {
                text: "logOut",
                icon: faPowerOff,
                link: "#",
            },
        ],
    }
}
