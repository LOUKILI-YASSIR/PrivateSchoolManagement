import { useState, useCallback } from "react";

/**
 * Custom hook for managing dialog state with additional features
 * @returns {Object} Dialog state and control functions
 */
export const useActionMenu = () => {
    const [open, setOpen] = useState(false);

    // Improved close handler with reason handling
    const ClickToClose = useCallback((event, reason) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
        }
    }, []);

    // Open dialog
    const ClickToOpen = useCallback(() => {
        setOpen(true);
    }, []);

    // Force close regardless of reason
    const forceClose = useCallback(() => {
        setOpen(false);
    }, []);

    return {
        open, 
        setOpen, 
        ClickToClose, 
        ClickToOpen,
        forceClose
    };
};