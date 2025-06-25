import { faCog, faUserPlus, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

// This function should receive the translation function and translated table name as parameters
export const getFromActionMenu = (actionType, tableName, t, tableNameTranslated,className) => {
    // Get action text with the table name inserted
    const actionText = t ? t(actionType, { NomTable: tableNameTranslated }) : `${actionType} ${tableNameTranslated}`;
    
    return {
        ADD: {
            Title: t ? t('form.add_title', { entity: tableNameTranslated }) : `Add ${tableNameTranslated}`,
            MainBtn: ({ClickToOpen}) => ( 
                <Tooltip title={actionText}>
                    <IconButton style={{ borderRadius: "5px" }} className='px-3' onClick={ClickToOpen}>
                        <FontAwesomeIcon icon={faUserPlus} className="h5 mt-2 text-blue-600"/>
                    </IconButton>
                </Tooltip>
            ),
            Btns: [
                {
                    handleClose: true,
                    value: t ? t('actions.cancel') : 'Cancel'
                },
                {
                    handleClick: () => {
                        console.log("Form submitted");
                    },
                    handleClose: true,
                    value: t ? t('form.submit') : 'Submit',
                }
            ]
        },
        UPDATE: {
            Title: t ? t('form.edit_title', { entity: tableNameTranslated }) : `Edit ${tableNameTranslated}`,
            MainBtn: ({ClickToOpen}) => (
                <span className={className || "hover:text-green-600 flex p-2 pl-3 cursor-pointer "} onClick={ClickToOpen}>
                    <EditIcon />
                    <div className="pl-2">{t ? t('actions.edit') : 'Edit'}</div>
                </span>
            ),
            Btns: [
                {
                    handleClose: true,
                    value: t ? t('actions.cancel') : 'Cancel'
                },
                {
                    handleClick: () => {
                        console.log("Form submitted");
                    },
                    handleClose: true,
                    value: t ? t('form.submit') : 'Submit',
                }
            ]
        },
        CONFIG: {
            Title: t ? t('form.config_title', { entity: tableNameTranslated }) : `Config ${tableNameTranslated}`,
            MainBtn: ({ClickToOpen}) => (
                <Tooltip title={actionText}>
                    <IconButton style={{ borderRadius: "5px" }} className='px-3' onClick={ClickToOpen}>
                        <FontAwesomeIcon icon={faCog} className="h5 mt-2 text-black"/>
                    </IconButton>
                </Tooltip>
            ),
            Btns: [
                {
                    handleClose: true,
                    value: t ? t('actions.cancel') : 'Cancel'
                },
                {
                    handleClick: () => {
                        console.log("Form submitted");
                    },
                    handleClose: true,
                    value: t ? t('form.submit') : 'Submit',
                }
            ]
        },
    };
};
