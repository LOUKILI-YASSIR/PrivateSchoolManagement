import jsPDF from "jspdf";
import "jspdf-autotable";

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

export const exportToPdf = (data, tableName) => {
  if (data.length === 0) {
    console.error("No data to export!");
    return;
  }
  
  data = limitColumns(data);
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const columns = Object.keys(data[0]).map((key) => ({
    header: key.toUpperCase(),
    dataKey: key,
  }));

  doc.autoTable({
    head: [columns.map((col) => col.header)],
    body: data.map((row) => Object.values(row)),
    margin: { top: 30 },
    styles: { 
      fontSize: 8,
    },
    headStyles: {
      fontSize: 8.5,
      fillColor: [22, 160, 133],
      textColor: 255,
      halign: "center",
    },
    bodyStyles: { halign: "center" },
    theme: "grid",
    startY: 30,
    didDrawPage: (data) => {
      const title = `${tableName} Report`;
      const subtitle = `Generated on: ${new Date().toLocaleDateString()}`;
      doc.setFontSize(16);
      doc.text(title, pageWidth / 2, 15, { align: "center" });
      doc.setFontSize(10);
      doc.text(subtitle, pageWidth / 2, 22, { align: "center" });
    },
  });

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

  doc.save(`${tableName}_Report.pdf`);
};
