import { useDispatch, useSelector } from "react-redux"
import { UseExportData } from "./useExportfile";
import { ChangeFileExtention, ChangeIndexExportType } from "../../../store/slices/ExportSlice";
import { useContext } from "react";
import { MainContext } from "../../../modules/main_content/contexts/MainContext";

export const UseExport = () => {
    const { fileExtension, IndexExportType } = useSelector(state=>state.Export)
    const { data, tableData } = useContext(MainContext);
    const { handleExportData, handleExportRows } = UseExportData();
    
    const handleExportSelected = ()=>(
        IndexExportType===0
        ? handleExportData(fileExtension,data)
        : handleExportRows(
            (
                [
                    tableData?.getPrePaginationRowModel()?.rows,
                    tableData?.getRowModel()?.rows,
                    tableData?.getSelectedRowModel()?.rows
                ][IndexExportType-1]
            ),fileExtension
        )
    );
    const ClickToExport = (event) => {
        handleExportSelected()
    }


    return {
        ClickToExport
    }
}
export const SetExportInfo = () => {
    const Dispatch = useDispatch();
    const { fileExtension, IndexExportType } = useSelector(state=>state.Export)
    const { tableData } = useContext(MainContext)
    return {
        SelectFileExtention : (event) => { Dispatch(ChangeFileExtention(event.target.value)) },
        SelectIndexExportType : (event) => { Dispatch(ChangeIndexExportType(event.target.value)) },
        IndexExportType, fileExtension, tableData
    }
}