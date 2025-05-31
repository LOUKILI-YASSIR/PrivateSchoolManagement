import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { exportStudentsToExcel } from "../students/StudentExport.jsx";

// Format object values based on selected sub-properties
const formatObjectValue = (value, selectedSubProperties = {}) => {
  if (value === null || value === undefined) return "";
  if (typeof value !== "object" || Array.isArray(value) || value instanceof Date) return value;
  
  // Get the column key from the cell context
  const columnKey = Object.keys(selectedSubProperties).find(key => {
    const subProps = selectedSubProperties[key];
    if (!subProps || !subProps.length) return false;
    
    // Check if this object has at least one of the selected sub-properties
    return subProps.some(prop => prop in value);
  });
  
  if (columnKey && selectedSubProperties[columnKey]?.length > 0) {
    // Format only selected sub-properties
    const subProps = selectedSubProperties[columnKey];
    return subProps
      .filter(prop => prop in value)
      .map(prop => `${prop}: ${value[prop]}`)
      .join(' | ');
  }
  
  // Default: stringify the whole object
  return JSON.stringify(value);
};

// Filter data to only include selected columns
const filterSelectedColumns = (data, selectedColumns, selectedSubProperties = {}) => {
  if (!data || data.length === 0) return [];
  
  // If no columns selected, return all data
  if (!selectedColumns || selectedColumns.length === 0) {
    return data;
  }
  
  console.log("Excel Export: Filtering data with selected columns:", selectedColumns);
  
  return data.map((row) => {
    const filteredRow = {};
    
    selectedColumns.forEach(key => {
      // Handle nested properties (e.g., "user.NomPL")
      if (key.includes('.')) {
        const parts = key.split('.');
        let value = row;
        
        // Navigate through the nested objects
        for (const part of parts) {
          if (value && typeof value === 'object') {
            value = value[part];
          } else {
            value = undefined;
            break;
          }
        }
        
        // Use the last part as the property name in the filtered row
        if (value !== undefined) {
          // Format object values if needed
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            filteredRow[parts[parts.length - 1]] = formatObjectValue(value, selectedSubProperties);
          } else {
            filteredRow[parts[parts.length - 1]] = value;
          }
        }
      } 
      // Handle direct properties
      else if (key in row) {
        // Format object values if needed
        if (typeof row[key] === 'object' && row[key] !== null && !Array.isArray(row[key])) {
          filteredRow[key] = formatObjectValue(row[key], selectedSubProperties);
        } else {
          filteredRow[key] = row[key];
        }
      }
    });
    
    return filteredRow;
  });
};

export const exportToExcel = (data, tableName, selectedColumns = [], exportNotes = "", attendanceOptions = null, gradeOptions = null, selectedSubProperties = {}) => {
  // Use student-specific export handler for student data
  if (tableName === "Etudiants" || tableName === "students") {
    return exportStudentsToExcel(data, selectedColumns, exportNotes, attendanceOptions, gradeOptions);
  }

  console.log("Excel Export Handler called with:", {
    columns: selectedColumns,
    subProperties: selectedSubProperties
  });

  // Filter data using selected columns
  const filteredData = filterSelectedColumns(data, selectedColumns, selectedSubProperties);
  
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  XLSX.utils.book_append_sheet(workbook, worksheet, tableName);
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${tableName}.xlsx`);
};
