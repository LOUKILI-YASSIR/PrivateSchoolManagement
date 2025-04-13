import { exportToPdf, exportToExcel, exportToCsv, exportToWord } from '../handlers';

export const UseExportData = () => {
  const handleExportData = async (fileExtension, data) => {
    try {
      const tableName = "Etudiants";
      switch (fileExtension.toLowerCase()) {
        case "excel":
          await exportToExcel(data, tableName);
          break;
        case "pdf":
          await exportToPdf(data, tableName);
          break;
        case "csv":
          await exportToCsv(data, tableName);
          break;
        case "word":
          await exportToWord(data, tableName);
          break;
        default:
          console.error("Unsupported file extension");
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  };

  const handleExportRows = async (rows, fileExtension) => {
    if (!rows || rows.length === 0) {
      console.error("No rows to export!");
      return;
    }

    const rowData = rows.map((row) => row?.original || row);
    await handleExportData(fileExtension, rowData);
  };

  return { handleExportData, handleExportRows };
};