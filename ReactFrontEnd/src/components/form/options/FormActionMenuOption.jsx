import { faUserPlus, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
export const getFromActionMenu = (AddOption) => ({
    ADD : {
        Title: "Inscription d'un Etudiant",
        MainBtn : ({ClickToOpen}) => ( 
            <Tooltip title={AddOption}>
                <IconButton style={{ borderRadius: "5px" }} className='px-3' onClick={ClickToOpen}>
                    <FontAwesomeIcon icon={faUserPlus} className="h5 mt-2 text-blue-600"/>
                </IconButton>
            </Tooltip>
        ),
        Btns: [
            {
                handleClose: true,
                value: "cancel"
            },
            {
                handleClick: () => {
                    DeleteSelected(rows);
                },
                handleClose: true,
                value: "Submit",
            }
        ]
    },
    UPDATE : {
        Title: "Modification d'un Etudiant",
        MainBtn : ({ClickToOpen}) => (
            <span className="hover:text-green-600 flex p-2 pl-3 cursor-pointer" onClick={ClickToOpen}>
                <EditIcon />
                <div className="pl-2">Modifier</div>
            </span>
        ),
        Btns: [
            {
                handleClose: true,
                value: "cancel"
            },
            {
                handleClick: () => {
                    DeleteSelected(rows);
                },
                handleClose: true,
                value: "Submit",
            }
        ]
    },
})
