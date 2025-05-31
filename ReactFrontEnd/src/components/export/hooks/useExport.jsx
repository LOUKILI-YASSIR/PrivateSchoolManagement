import { useDispatch, useSelector } from "react-redux"
import { UseExportData } from "./useExportfile";
import { ChangeFileExtention, ChangeIndexExportType } from "../../../store/slices/ExportSlice";
import { useContext, useState } from "react";
import { MainContext } from "../../../utils/contexts/MainContext";
import { Snackbar, Alert } from "@mui/material";

export const UseExport = () => {
    const { fileExtension, IndexExportType, selectedColumns, exportNotes, selectedSubProperties } = useSelector(state=>state.Export)
    const { data, tableData } = useContext(MainContext);
    const { handleExportData, handleExportRows } = UseExportData();
    const [showSuccess, setShowSuccess] = useState(false);
    
    const handleExportSelected = (attendanceOptions = null, gradeOptions = null, customSubProperties = null) => {
        try {
            // Use provided sub-properties or fall back to Redux state
            const subProps = customSubProperties || selectedSubProperties;
            
            if (IndexExportType === 0) {
                handleExportData(fileExtension, data, {
                    columns: selectedColumns,
                    notes: exportNotes,
                    attendance: attendanceOptions,
                    grades: gradeOptions,
                    subProperties: subProps
                });
            } else {
                const rows = [
                    tableData?.getPrePaginationRowModel()?.rows,
                    tableData?.getRowModel()?.rows,
                    tableData?.getSelectedRowModel()?.rows
                ][IndexExportType - 1];
                
                handleExportRows(rows, fileExtension, {
                    columns: selectedColumns,
                    notes: exportNotes,
                    attendance: attendanceOptions,
                    grades: gradeOptions,
                    subProperties: subProps
                });
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
    
    const ClickToExport = (options = {}) => {
        return handleExportSelected(options.attendance, options.grades, options.subProperties);
    };

    return {
        ClickToExport,
        showSuccess,
        setShowSuccess
    }
}

export const SetExportInfo = () => {
    const Dispatch = useDispatch();
    const { fileExtension, IndexExportType, selectedColumns, exportNotes, selectedSubProperties } = useSelector(state=>state.Export)
    const { tableData } = useContext(MainContext)
    return {
        SelectFileExtention: (event) => { Dispatch(ChangeFileExtention(event.target.value)) },
        SelectIndexExportType: (event) => { Dispatch(ChangeIndexExportType(event.target.value)) },
        IndexExportType,
        fileExtension,
        selectedColumns,
        exportNotes,
        selectedSubProperties,
        tableData
    }
}