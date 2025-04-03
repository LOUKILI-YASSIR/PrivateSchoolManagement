import { useDispatch, useSelector } from "react-redux"
import { UseExportData } from "./useExportfile";
import { ChangeFileExtention, ChangeIndexExportType } from "../../../store/slices/ExportSlice";
import { useContext, useState } from "react";
import { MainContext } from "../../../utils/contexts/MainContext";
import { Snackbar, Alert } from "@mui/material";

export const UseExport = () => {
    const { fileExtension, IndexExportType } = useSelector(state=>state.Export)
    const { data, tableData } = useContext(MainContext);
    const { handleExportData, handleExportRows } = UseExportData();
    const [showSuccess, setShowSuccess] = useState(false);
    
    const handleExportSelected = () => {
        try {
            if (IndexExportType === 0) {
                handleExportData(fileExtension, data);
            } else {
                const rows = [
                    tableData?.getPrePaginationRowModel()?.rows,
                    tableData?.getRowModel()?.rows,
                    tableData?.getSelectedRowModel()?.rows
                ][IndexExportType - 1];
                
                handleExportRows(rows, fileExtension);
            }
            
            // Show success notification
            setShowSuccess(true);
            
            // Add animation to export button
            const exportButton = document.querySelector('.export-icon');
            if (exportButton) {
                exportButton.classList.add('export-success');
                setTimeout(() => {
                    exportButton.classList.remove('export-success');
                }, 1500);
            }
            
            return true;
        } catch (error) {
            console.error('Export error:', error);
            return false;
        }
    };
    
    const ClickToExport = () => {
        return handleExportSelected();
    };

    return {
        ClickToExport,
        showSuccess,
        setShowSuccess
    }
}

export const SetExportInfo = () => {
    const Dispatch = useDispatch();
    const { fileExtension, IndexExportType } = useSelector(state=>state.Export)
    const { tableData } = useContext(MainContext)
    return {
        SelectFileExtention: (event) => { Dispatch(ChangeFileExtention(event.target.value)) },
        SelectIndexExportType: (event) => { Dispatch(ChangeIndexExportType(event.target.value)) },
        IndexExportType,
        fileExtension,
        tableData
    }
}