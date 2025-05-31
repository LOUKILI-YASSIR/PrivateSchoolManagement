import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Delete } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { MRT_ActionMenuItem } from "material-react-table";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { MainContext } from "../../../utils/contexts/MainContext";
import GradeIcon from '@mui/icons-material/Grade';

export const getActionOptionsMenu = (rows=[], DeleteSelected=()=>null,DeleteOption="") => {
    const { t: Traduction } = useTranslation();
    const { tableData } = useContext(MainContext)
    return {
        BoxOptionDeleteByN: {
            Title: Traduction("validationTexts.deleteByN", { length: rows.length }),
            MainBtn : ({ClickToOpen}) => ( 
                <Tooltip title={ DeleteOption }>
                    <IconButton
                        style = {{ borderRadius: "5px", color: rows.length ? "red" : "gray" }}
                        className = "px-3"
                        onClick={() => !!rows.length && ClickToOpen()}
                    >
                        <FontAwesomeIcon icon={faTrashCan} className="h5 mt-2"/>
                    </IconButton>
                </Tooltip>
            ),
            Btns: [
                {
                    handleClose: true,
                    value: Traduction("actions.cancel")
                },
                {
                    handleClick: () => {
                        DeleteSelected(rows);
                    },
                    handleClose: true,
                    value: Traduction("actions.delete")
                }
            ]
        },
        BoxOptionDeleteBy1 : (Options)=> {
            const { handleDelete, closeMenu, itemId, Traduction } = Options
            return {
                Title: Traduction("validationTexts.deleteBy1"),
                MainBtn : ({ClickToOpen})=>(
                    <span className="hover:text-red-600 flex p-2 pl-3 cursor-pointer" onClick={ClickToOpen}>
                        <Delete/>
                        <div className="pl-2">{Traduction("actions.delete")}</div>
                    </span>
                ), 
                Btns: [
                    {
                        handleClick: () => closeMenu(),
                        value: Traduction("actions.cancel"),
                        handleClose : true
                    },
                    {
                        handleClick: () => {
                            handleDelete(itemId);
                            closeMenu()
                        },
                        value: Traduction("actions.delete"),
                        handleClose : true
                    }
                ]
            }
        },
        BoxOptionGrade: (Options)=> {
            const { handleSetGrade, closeMenu, itemId, Traduction } = Options
            return {
                Title: Traduction("validationTexts.deleteBy1"),
                MainBtn : ({ClickToOpen})=>(
                    <span className="hover:text-red-600 flex p-2 pl-3 cursor-pointer" onClick={ClickToOpen}>
                        <GradeIcon/>
                        <div className="pl-2">{Traduction("actions.grade")}</div>
                    </span>
                ), 
                Btns: [
                    {
                        handleClick: () => closeMenu(),
                        value: Traduction("actions.cancel"),
                        handleClose : true
                    },
                    {
                        handleClick: () => {
                            handleSetGrade(itemId);
                            closeMenu()
                        },
                        value: Traduction("actions.grade"),
                        handleClose : true
                    }
                ]
            }
        }
    };
};