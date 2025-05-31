import { exportToPdf, exportToExcel, exportToCsv } from '../handlers';
import { useSelector } from 'react-redux';
import { getStudentColumnsConfig } from '../students/StudentExport.jsx';
import { useContext } from 'react';
import { MainContext } from '../../../utils/contexts/MainContext';

export const UseExportData = () => {
  const { selectedColumns, exportNotes, selectedSubProperties } = useSelector(state => state.Export);
  const { TableName } = useContext(MainContext);

  const handleExportData = async (fileExtension, data, options = {}) => {
    try {
      // Use TableName to determine the table type
      let tableName = TableName || "Data";
      
      // Extract options
      const exportColumns = options.columns || selectedColumns;
      const notes = options.notes || exportNotes;
      const attendanceOpts = options.attendance;
      const gradeOpts = options.grades;
      const subProps = options.subProperties || selectedSubProperties || {};
      
      // Ensure we have columns to export
      if (!exportColumns || exportColumns.length === 0) {
        console.error("No columns selected for export");
        return false;
      }
      
      // Proceed with export based on file type
      switch (fileExtension.toLowerCase()) {
        case "excel":
          await exportToExcel(data, tableName, exportColumns, notes, attendanceOpts, gradeOpts, subProps);
          break;
        case "pdf":
          await exportToPdf(data, tableName, exportColumns, notes, attendanceOpts, gradeOpts, subProps);
          break;
        case "csv":
          await exportToCsv(data, tableName, exportColumns, notes, attendanceOpts, gradeOpts, subProps);
          break;
        default:
          console.error("Unsupported file extension");
          return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      return false;
    }
  };

  const handleExportRows = async (rows, fileExtension, options = {}) => {
    if (!rows || rows.length === 0) {
      console.error("No rows to export!");
      return false;
    }

    const rowData = rows.map((row) => row?.original || row);
    return await handleExportData(fileExtension, rowData, options);
  };

  return { handleExportData, handleExportRows };
};