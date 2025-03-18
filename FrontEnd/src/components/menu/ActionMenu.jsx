import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useActionMenu } from "./hooks/useActionMenu";
import { Fragment } from "react";

export default function ActionMenu({ DialogContentComponent, contentOptions, isTitleH1=false, isFormWidth=false}) {
    const { ClickToClose, open, ClickToOpen } = useActionMenu();
    const { Title, Btns, MainBtn } = contentOptions;
    return (
        <Fragment>
            <MainBtn {...{ClickToOpen}} />
            <Dialog disableEscapeKeyDown open={open} onClose={ClickToClose} maxWidth="lg">
                <DialogTitle className="text"><span className={isTitleH1 ? "h2" : "h4"}>{Title}</span></DialogTitle>
                {DialogContentComponent && <DialogContent style={ isFormWidth ? {width:"1000px"} : {} }>{DialogContentComponent}</DialogContent>}
                <DialogActions>
                    {
                        Btns.map(btn => (
                            <Button
                                key={`${btn.value}_BtnActions`}
                                onClick={() => {
                                    btn.handleClose && ClickToClose();
                                    btn.handleClick && btn.handleClick();
                                }}
                                className={btn.className || ""}
                                disabled={!!btn.disabled}
                                style={btn.style || {}}
                            >
                                {btn.value}
                            </Button>
                        ))
                    }
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}