import { etudiantsColumns } from "../../table/hooks/columns/etudiantsColumns.jsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { getFullCountryName } from "../utils/countryUtils.js";
import i18next from "i18next";

// Format the value for display
const formatCellValue = (value, column, options = {}) => {
  if (value === null || value === undefined) return "";
  
  // For boolean values
  if (typeof value === "boolean") return value ? "Yes" : "No";
  
  // For date fields
  if (column.accessorKey?.includes("Date") && value) {
    try {
      return new Date(value).toLocaleDateString();
    } catch (e) {
      return value;
    }
  }
  
  // For country codes
  if (column.accessorKey === "user.PaysPL" || column.accessorKey === "user.NationalitePL") {
    return getFullCountryName(value) || value;
  }
  
  // For attendance stats
  if (column.accessorKey === "attendanceStats") {
    const stats = value || {};
    // Check if attendance options are provided
    const attendanceOpts = options.attendance || {
      present: true,
      absent: true,
      late: true,
      excused: true
    };
    
    // Format based on export type
    if (options.isPdf) {
      // Format with full words for PDF in French
      let parts = [];
      
      if (attendanceOpts.present) {
        const present = stats.presentPercentage || 0;
        parts.push(`${i18next.t("students.attendance.present", "Présence")}: ${present}%`);
      }
      
      if (attendanceOpts.absent) {
        const absent = stats.absentPercentage || 0;
        parts.push(`${i18next.t("students.attendance.absent", "Absent")}: ${absent}%`);
      }
      
      if (attendanceOpts.late) {
        const late = stats.latePercentage || 0;
        parts.push(`${i18next.t("students.attendance.late", "Retard")}: ${late}%`);
      }
      
      if (attendanceOpts.excused) {
        const excused = stats.excusedPercentage || 0;
        parts.push(`${i18next.t("students.attendance.excused", "Justifié")}: ${excused}%`);
      }
      
      return parts.join(" | ");
    } else {
      // Regular format for Excel/CSV
      let result = [];
      if (attendanceOpts.present) {
        const present = stats.presentPercentage || 0;
        result.push(`${i18next.t("students.attendance.present", "Présence")}: ${present}%`);
      }
      
      if (attendanceOpts.absent) {
        const absent = stats.absentPercentage || 0;
        result.push(`${i18next.t("students.attendance.absent", "Absent")}: ${absent}%`);
      }
      
      if (attendanceOpts.late) {
        const late = stats.latePercentage || 0;
        result.push(`${i18next.t("students.attendance.late", "Retard")}: ${late}%`);
      }
      
      if (attendanceOpts.excused) {
        const excused = stats.excusedPercentage || 0;
        result.push(`${i18next.t("students.attendance.excused", "Justifié")}: ${excused}%`);
      }
      
      return result.join(", ");
    }
  }
  
  // For grade stats
  if (column.accessorKey === "gradeStats.average") {
    if (!value) return '0/20';
    
    // Simplified grade display - only show final grade
    const finalGrade = typeof value === 'object' ? (value.final || value.average || 0) : value;
    return `${i18next.t("Data.finalGrade", "Note Finale")}: ${parseFloat(finalGrade).toFixed(2)}/20`;
  }
  
  // For regular string/number
  return String(value);
};

// Extract value from nested object based on accessor key
const getNestedValue = (obj, accessorKey) => {
  if (!accessorKey || !obj) return '';
  
  // Handle simple accessors
  if (typeof accessorKey === 'string' && !accessorKey.includes('.')) {
    return obj[accessorKey];
  }
  
  // Handle nested accessors (e.g., "user.NomPL")
  const keys = accessorKey.split('.');
  return keys.reduce((o, key) => (o && o[key] !== undefined) ? o[key] : '', obj);
};

// Get translated column name
const getColumnDisplayName = (column, translate) => {
  // For custom fields like attendanceStats, extract the base name
  const headerText = typeof column.header === 'function' 
    ? column.header(translate)
    : column.header || column.accessorKey || '';
  
  return headerText;
};

// Get columns configuration from etudiantsColumns with translation
export const getStudentColumnsConfig = (translate) => {
  if (!translate) translate = (key) => key;
  return etudiantsColumns(translate, {
    equality: ["equals", "notEquals"],
    text: ["contains", "notContains", "startsWith", "endsWith"],
    comparison: ["greaterThan", "lessThan", "greaterThanOrEqualTo", "lessThanOrEqualTo"],
    range: ["betweenInclusive", "betweenExclusive"],
  });
};

// Format students data for export based on selected columns
export const formatStudentsDataForExport = (data, columns, selectedColumns = [], options = {}) => {
  console.log("Export options:", options);
  
  // If no columns selected, use first 6 columns
  const columnsToUse = selectedColumns.length > 0 
    ? columns.filter(col => selectedColumns.includes(col.accessorKey))
    : columns.slice(0, 6);
  
  console.log("Columns to use:", columnsToUse.map(col => col.accessorKey));
  
  // Map data to only include the selected columns
  return data.map(student => {
    const formattedRow = {};
    
    columnsToUse.forEach(column => {
      const accessorKey = column.accessorKey;
      if (!accessorKey) return;
      
      const value = getNestedValue(student, accessorKey);
      // For debugging grades and attendance
      if (accessorKey === 'gradeStats.average') {
        console.log("Processing grade data:", { 
          studentId: student.MatriculeET || 'unknown',
          value,
          options
        });
      }
      
      formattedRow[getColumnDisplayName(column, i18next.t)] = formatCellValue(value, column, options);
    });
    
    return formattedRow;
  });
};

// Export students data to PDF
export const exportStudentsToPdf = (data, selectedColumns = [], exportNotes = "", attendanceOptions = null, gradeOptions = null) => {
  if (!data || data.length === 0) {
    console.error("No student data to export!");
    return;
  }
  
  console.log("PDF Export called with options:", { 
    selectedColumns, 
    attendance: attendanceOptions, 
    grades: gradeOptions 
  });
  
  // Simplified grade options
  const simpleGradeOptions = {
    finalGrade: true
  };
  
  // Get column configuration with translation function
  const columns = getStudentColumnsConfig(i18next.t);
  
  // Format data for export with options
  const formattedData = formatStudentsDataForExport(data, columns, selectedColumns, { 
    attendance: attendanceOptions,
    grades: simpleGradeOptions,
    isPdf: true
  });
  
  // Create PDF document with orientation based on columns count
  const orientation = selectedColumns.length > 4 ? "landscape" : "portrait";
  const doc = new jsPDF({
    orientation: orientation,
    unit: "mm",
    format: "a4",
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add header with school logo if available
  doc.setFillColor(42, 33, 133); // School color from the UI
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");

  // Add school logo placeholder - schools can replace with their logo
  try {
    // If logo exists at this path, it will be used
    const imgData = "/logo.png";
    doc.addImage(imgData, "PNG", 14, 5, 20, 20);
    doc.text(i18next.t("app.title", "PRIVATE SCHOOL MANAGEMENT"), 40, 17);
  } catch (e) {
    // If logo fails to load, just show text centered
    doc.text(i18next.t("app.title", "PRIVATE SCHOOL MANAGEMENT"), pageWidth / 2, 17, { align: "center" });
  }
  
  // Add decorative elements
  doc.setDrawColor(42, 33, 133);
  doc.setLineWidth(1);
  doc.line(10, 35, pageWidth - 10, 35);
  
  // Report title with icon indicator
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(42, 33, 133);
  doc.text(`${i18next.t("students.title", "Students")} ${i18next.t("export.report", "Report")}`, pageWidth / 2, 45, { align: "center" });
  
  // Report metadata with better formatting
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "normal");
  const today = new Date();
  
  // Create metadata box
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(pageWidth / 2 - 40, 50, 80, 20, 3, 3, 'F');
  
  doc.text(`${i18next.t("export.generatedOn", "Generated on")}: ${today.toLocaleDateString()}`, pageWidth / 2, 57, { align: "center" });
  doc.text(`${i18next.t("export.time", "Time")}: ${today.toLocaleTimeString()}`, pageWidth / 2, 63, { align: "center" });
  
  // Add record count badge with WHITE text color
  doc.setFillColor(42, 33, 133);
  doc.roundedRect(14, 50, 60, 10, 5, 5, 'F');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255); // WHITE color for text
  doc.text(`${i18next.t("export.totalRecords", "Total Records")}: ${formattedData.length}`, 18, 57);
  
  // Prepare table data
  const head = [Object.keys(formattedData[0])];
  const body = formattedData.map(row => Object.values(row));
  
  // Calculate column widths based on content
  const columnStyles = {};
  const maxPageWidth = pageWidth - 20; // Account for margins
  const columnCount = head[0].length;
  
  // For fewer columns, give them more space
  if (columnCount <= 3) {
    // Equal distribution for few columns
    head[0].forEach((col, i) => {
      columnStyles[i] = { 
        cellWidth: maxPageWidth / columnCount
      };
    });
  } else {
    // For more columns, give proportional space based on content length
    const contentLengths = head[0].map((col, i) => {
      const headerLength = col.length;
      // Sample some rows to get average content length
      const contentSamples = body.slice(0, Math.min(10, body.length)).map(row => 
        String(row[i] || '').length
      );
      const avgContentLength = contentSamples.reduce((sum, len) => sum + len, 0) / contentSamples.length;
      return Math.max(headerLength, avgContentLength);
    });
    
    const totalContentLength = contentLengths.reduce((sum, len) => sum + len, 0);
    
    // Calculate proportional widths
    head[0].forEach((col, i) => {
      // Minimum 8% of page width, maximum 25%
      const proportion = Math.max(0.08, Math.min(0.25, contentLengths[i] / totalContentLength));
      columnStyles[i] = { 
        cellWidth: maxPageWidth * proportion
      };
    });
  }
  
  // Add table with enhanced styling
  doc.autoTable({
    head: head,
    body: body,
    startY: 75,
    styles: { 
      fontSize: 9,
      cellPadding: 4,
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
      overflow: 'linebreak',
      cellWidth: 'auto',
      minCellHeight: 12,
      valign: 'middle',
      halign: 'center',
    },
    headStyles: {
      fontSize: 10,
      fillColor: [42, 33, 133],
      textColor: 255,
      halign: "center",
      fontStyle: "bold",
    },
    bodyStyles: { 
      halign: "center",
      textColor: [50, 50, 50],
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    theme: "grid",
    tableLineColor: [100, 100, 100],
    tableLineWidth: 0.1,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    columnStyles: columnStyles,
    horizontalPageBreak: true,
    horizontalPageBreakRepeat: 0,
    showFoot: 'lastPage',
    showHead: 'firstPage',
    tableWidth: 'auto',
    willDrawCell: function(data) {
      // Increase row height for cells with a lot of content
      const cell = data.cell;
      const text = cell.text || '';
      if (typeof text === 'string') {
        const lineCount = text.split('\n').length;
        if (lineCount > 1) {
          data.row.height = Math.max(data.row.height, lineCount * 6);
        }
      }
    },
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
      
      // Add timestamp with icon
      doc.text(
        `${i18next.t("export.generated", "Generated")}: ${new Date().toLocaleString()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    },
  });

  // Add enhanced summary section with visualization
  const lastY = doc.lastAutoTable.finalY || 70;
  
  if (lastY + 50 < pageHeight) {
    // Summary section title
    doc.setFillColor(42, 33, 133, 0.05);
    doc.roundedRect(10, lastY + 10, pageWidth - 20, 40, 3, 3, 'F');
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(42, 33, 133);
    doc.text(i18next.t("export.summary", "Summary"), 14, lastY + 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    
    // Enhanced summary stats with data insights
    doc.text(`${i18next.t("export.totalRecords", "Total Records")}: ${formattedData.length}`, 14, lastY + 30);
    doc.text(`${i18next.t("export.columnsExported", "Columns Exported")}: ${head[0].length}`, pageWidth / 2, lastY + 30);
    
    // Add data timestamp range if available
    if (data[0]?.created_at) {
      const dates = data.map(item => new Date(item.created_at || 0));
      const oldestDate = new Date(Math.min(...dates));
      const newestDate = new Date(Math.max(...dates));
      
      doc.text(`${i18next.t("export.dataRange", "Data Range")}: ${oldestDate.toLocaleDateString()} - ${newestDate.toLocaleDateString()}`, 14, lastY + 40);
    }
    
    // Add notes section with better formatting if provided
    if (exportNotes && exportNotes.trim() !== "") {
      const notesY = lastY + 50;
      
      // Notes section with border
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.5);
      doc.roundedRect(14, notesY, pageWidth - 28, 30, 3, 3, 'S');
      
      // Notes header
      doc.setFillColor(245, 245, 245);
      doc.rect(14, notesY, pageWidth - 28, 8, 'F');
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 80);
      doc.text(`${i18next.t("export.notes", "Notes")}`, 18, notesY + 6);
      
      // Notes content
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      
      // Split notes into multiple lines if needed
      const maxWidth = pageWidth - 34; // margin on each side
      const lines = doc.splitTextToSize(exportNotes, maxWidth);
      
      // Add each line of the notes with better formatting
      lines.forEach((line, index) => {
        if (index < 5) { // Limit to 5 lines of notes
          doc.text(line, 18, notesY + 16 + (index * 5));
        }
      });
      
      // If notes are too long, add ellipsis
      if (lines.length > 5) {
        doc.text("...", 18, notesY + 16 + (5 * 5));
      }
    }
  }

  // Generate filename with date
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `Students_Report_${dateStr}.pdf`;
  
  doc.save(filename);
};

// Export students data to Excel
export const exportStudentsToExcel = (data, selectedColumns = [], exportNotes = "", attendanceOptions = null, gradeOptions = null) => {
  if (!data || data.length === 0) {
    console.error("No student data to export!");
    return;
  }
  
  // Get column configuration with translation function
  const columns = getStudentColumnsConfig(i18next.t);
  
  // Format data for export with options
  const formattedData = formatStudentsDataForExport(data, columns, selectedColumns, {
    attendance: attendanceOptions,
    grades: gradeOptions
  });
  
  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Add title and metadata
  XLSX.utils.sheet_add_aoa(worksheet, [
    [`${i18next.t("students.title", "Students")} ${i18next.t("export.report", "Report")}`],
    [`${i18next.t("export.generatedOn", "Generated on")}: ${new Date().toLocaleDateString()}`],
    [`${i18next.t("export.totalRecords", "Total Records")}: ${formattedData.length}`],
  ], { origin: "A1" });
  
  // Add notes if provided
  if (exportNotes && exportNotes.trim() !== "") {
    XLSX.utils.sheet_add_aoa(worksheet, [
      [`${i18next.t("export.notes", "Notes")}:`],
      [exportNotes]
    ], { origin: { r: 4, c: 0 } });
  }
  
  // Style headers (if XLSX supports this)
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, i18next.t("students.title", "Students"));
  
  // Generate Excel file and save
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${i18next.t("students.title", "Students")}_${i18next.t("export.report", "Report")}.xlsx`);
};

// Export students data to CSV
export const exportStudentsToCSV = (data, selectedColumns = [], exportNotes = "", attendanceOptions = null, gradeOptions = null) => {
  if (!data || data.length === 0) {
    console.error("No student data to export!");
    return;
  }
  
  // Get column configuration with translation function
  const columns = getStudentColumnsConfig(i18next.t);
  
  // Format data for export with options
  const formattedData = formatStudentsDataForExport(data, columns, selectedColumns, {
    attendance: attendanceOptions,
    grades: gradeOptions
  });
  
  // CSV configuration
  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
    filename: `${i18next.t("students.title", "Students")}_${i18next.t("export.report", "Report")}`,
    showColumnHeaders: true,
  });
  
  // Generate and download CSV
  const csv = generateCsv(csvConfig)(formattedData);
  download(csvConfig)(csv);
}; 