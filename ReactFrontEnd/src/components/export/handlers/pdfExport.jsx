import jsPDF from "jspdf";
import "jspdf-autotable";
import i18next from "i18next";
import { exportStudentsToPdf } from "../students/StudentExport.jsx";

// Get translated column name
const getTranslatedColumnName = (columnName, tableName) => {
  // Try to get a translation from the table-specific column
  const tableSpecificKey = `${tableName}.columns.${columnName}`;
  const genericKey = `columns.${columnName}`;
  
  // First try table-specific translation, then generic, then formatted column name
  return i18next.t(tableSpecificKey, { 
    defaultValue: i18next.t(genericKey, { 
      defaultValue: columnName.toUpperCase().replace(/_/g, " ") 
    }) 
  });
};

// Filter data to only include selected columns
const filterSelectedColumns = (data, selectedColumns) => {
  if (!data || data.length === 0) return [];
  
  // If no columns selected, use default behavior (limit to 9 columns)
  if (!selectedColumns || selectedColumns.length === 0) {
    return limitColumns(data);
  }
  
  console.log("Filtering data with selected columns:", selectedColumns);
  
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
          filteredRow[parts[parts.length - 1]] = value;
        }
      } 
      // Handle direct properties
      else if (key in row) {
        filteredRow[key] = row[key];
      }
    });
    
    return filteredRow;
  });
};

// Limit the number of columns to a manageable size
const limitColumns = (data, maxColumns = 9) => {
  if (!data || data.length === 0) return [];
  const keys = Object.keys(data[0]).slice(0, maxColumns);
  return data.map((row) =>
    keys.reduce((acc, key) => {
      acc[key] = row[key];
      return acc;
    }, {})
  );
};

// Format cell content for better display
const formatCellContent = (value, selectedSubProperties = {}) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value instanceof Date) return value.toLocaleDateString();
  
  // Handle object values with selected sub-properties
  if (typeof value === "object" && !Array.isArray(value) && value !== null) {
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
  }
  
  return String(value);
};

export const exportToPdf = (data, tableName, selectedColumns = [], exportNotes = "", attendanceOptions = null, gradeOptions = null, selectedSubProperties = {}) => {
  if (data.length === 0) {
    console.error("No data to export!");
    return;
  }
  
  console.log("PDF Export Handler called with:", {
    columns: selectedColumns,
    attendance: attendanceOptions,
    grades: gradeOptions,
    subProperties: selectedSubProperties
  });
  
  // Use student-specific export handler for student data
  if (tableName === "Etudiants" || tableName === "students") {
    return exportStudentsToPdf(data, selectedColumns, exportNotes, attendanceOptions, gradeOptions);
  }
  
  // Filter data using selected columns
  data = filterSelectedColumns(data, selectedColumns);
  
  // Create PDF document with orientation based on data size
  const orientation = data.length > 5 ? "landscape" : "portrait";
  const doc = new jsPDF({
    orientation: orientation,
    unit: "mm",
    format: "a4",
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add header
  doc.setFillColor(22, 160, 133);
  doc.rect(0, 0, pageWidth, 25, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(i18next.t("app.title", "PRIVATE SCHOOL MANAGEMENT"), pageWidth / 2, 15, { align: "center" });
  
  // Report title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(22, 160, 133);
  doc.text(`${i18next.t(`${tableName}.title`, tableName)} ${i18next.t("export.report", "Report")}`, pageWidth / 2, 35, { align: "center" });
  
  // Report metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  const today = new Date();
  doc.text(`${i18next.t("export.generatedOn", "Generated on")}: ${today.toLocaleDateString()}`, pageWidth / 2, 47, { align: "center" });
  doc.text(`${i18next.t("export.time", "Time")}: ${today.toLocaleTimeString()}`, pageWidth / 2, 52, { align: "center" });
  
  // Prepare table data
  const dataKeys = Object.keys(data[0]);
  const columns = dataKeys.map(key => ({
    header: getTranslatedColumnName(key, tableName),
    dataKey: key
  }));

  // Format data for better display
  const formattedData = data.map(row => 
    dataKeys.map(key => formatCellContent(row[key], selectedSubProperties))
  );
  
  // Add table with styling
  doc.autoTable({
    head: [columns.map(col => col.header)],
    body: formattedData,
    startY: 60,
    styles: { 
      fontSize: 9,
      cellPadding: 3,
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
    },
    headStyles: {
      fontSize: 10,
      fillColor: [22, 160, 133],
      textColor: 255,
      halign: "center",
      fontStyle: "bold",
    },
    bodyStyles: { 
      halign: "center",
      textColor: [50, 50, 50],
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    theme: "grid",
    tableLineColor: [100, 100, 100],
    tableLineWidth: 0.1,
    didDrawPage: (data) => {
      // Add footer on each page
      doc.setFillColor(240, 240, 240);
      doc.rect(0, pageHeight - 20, pageWidth, 20, "F");
      
      // Page numbering
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `${i18next.t("export.page", "Page")} ${doc.internal.getNumberOfPages()}`,
        pageWidth - 20,
        pageHeight - 10
      );
      
      // Footer text
      doc.setFontSize(8);
      doc.text(
        i18next.t("export.footerText", "Private School Management System - Confidential"),
        15,
        pageHeight - 10
      );
      
      // Add timestamp
      doc.text(
        `${i18next.t("export.generated", "Generated")}: ${new Date().toLocaleString()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    },
  });

  // Add simple summary section
  const lastY = doc.lastAutoTable.finalY || 70;
  
  if (lastY + 30 < pageHeight) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 160, 133);
    doc.text(i18next.t("export.summary", "Summary"), 14, lastY + 10);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    
    // Simple summary stats
    doc.text(`${i18next.t("export.totalRecords", "Total Records")}: ${data.length}`, 14, lastY + 20);
    doc.text(`${i18next.t("export.columnsExported", "Columns Exported")}: ${dataKeys.length}`, 14, lastY + 27);
    
    // Add notes if provided
    if (exportNotes && exportNotes.trim() !== "") {
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      
      doc.text(`${i18next.t("export.notes", "Notes")}:`, 14, lastY + 37);
      
      // Split notes into multiple lines if needed
      const maxWidth = pageWidth - 28; // 14mm margin on each side
      const lines = doc.splitTextToSize(exportNotes, maxWidth);
      
      // Add each line of the notes
      lines.forEach((line, index) => {
        if (index < 5) { // Limit to 5 lines of notes
          doc.text(line, 14, lastY + 44 + (index * 5));
        }
      });
      
      // If notes are too long, add ellipsis
      if (lines.length > 5) {
        doc.text("...", 14, lastY + 44 + (5 * 5));
      }
    }
  }

  doc.save(`${tableName}_${i18next.t("export.report", "Report")}.pdf`);
};
