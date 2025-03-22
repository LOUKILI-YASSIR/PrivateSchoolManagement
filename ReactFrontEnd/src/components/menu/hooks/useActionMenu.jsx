import { useState } from "react";

export const useActionMenu = () => {
    const [open, setOpen] = useState(false);

    const ClickToClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
        }
    };

    const ClickToOpen = () => {
        setOpen(true);
    };

    return {
        open, setOpen, ClickToClose, ClickToOpen
    };
};