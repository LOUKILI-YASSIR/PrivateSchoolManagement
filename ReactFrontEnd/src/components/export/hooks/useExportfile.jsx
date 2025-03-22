import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { mkConfig, generateCsv, download } from "export-to-csv";
// use Mehthodes 
export const UseExportData = () => {
  // Export Methodes 
  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
    filename: "Etudiants",
  })

  // Limit the number of columns to a manageable size
  const limitColumns = (data, maxColumns = 9) => {
    if (!data || data.length === 0) return [];
    const keys = Object.keys(data[0]).slice(0, maxColumns); // Get the first maxColumns keys
    return data.map((row) =>
      keys.reduce((acc, key) => {
        acc[key] = row[key]; // Only include the allowed keys
        return acc;
      }, {})
    );
  };

  const ExportXlsx=(data,TableName)=>{
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Etudiants");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${TableName}.xlsx`);
  }

  const ExportPdf = (data, TableName) => {
    
    if (data.length === 0) {
      console.error("No data to export!");
      return;
    }
    
    data = limitColumns(data);
    
    // Initialize jsPDF instance
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
  
    // Format the table data
    const columns = Object.keys(data[0]).map((key) => ({
      header: key.toUpperCase(), // Convert keys to uppercase for headers
      dataKey: key,
    }));
  
    // Use autoTable plugin for the table
    doc.autoTable({
      head: [columns.map((col) => col.header)], // Table headers
      body: data.map((row) => Object.values(row)), // Table rows
      margin: { top: 30 }, // Margin from the top
      styles: { 
        fontSize: 8,
      }, // Font size for table
      headStyles: {
        fontSize: 8.5,
        fillColor: [22, 160, 133], // Header background color
        textColor: 255, // Header text color
        halign: "center", // Center align header text
      },
      
      bodyStyles: { halign: "center" }, // Center align body text
      theme: "grid", // Table theme
      startY: 30, // Start position for the table
      didDrawPage: (data) => {
        // Title and header
        const title = `${TableName} Report`;
        const subtitle = `Generated on: ${new Date().toLocaleDateString()}`;
        doc.setFontSize(16);
        doc.text(title, pageWidth / 2, 15, { align: "center" });
        doc.setFontSize(10);
        doc.text(subtitle, pageWidth / 2, 22, { align: "center" });
      },
    });
  
    // Add footer (optional)
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }
  
    // Save the PDF
    doc.save(`${TableName}_Report.pdf`);
  };
  
  return { 
    handleExportRows : (rows, format) => {
      const rowData = rows.map((row) => row?.original || row);
      switch(format){
        case "Csv":
          const csv = generateCsv(csvConfig)(rowData);
          download(csvConfig)(csv);
          break;
        case "Excel":
          ExportXlsx(rowData,"Etudiants");
          break;
        case "Pdf":
          ExportPdf(rowData,"Etudiants");
          break;
      }
    },
    handleExportData : (format,Data) => {
      
      switch(format){
        case "Csv":
          const csv = generateCsv(csvConfig)(Data);
          download(csvConfig)(csv);
          break;
        case "Excel": 
          ExportXlsx(Data,"Etudiants");
          break;
        case "Pdf":
          ExportPdf(Data,"Etudiants");
          break;
      }
    }
  }
}
