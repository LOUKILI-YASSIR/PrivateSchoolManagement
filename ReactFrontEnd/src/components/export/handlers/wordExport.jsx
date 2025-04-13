import { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

const createHeader = (tableName) => {
  return new Paragraph({
    text: `${tableName} Report`,
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
  });
};

const createSubHeader = () => {
  return new Paragraph({
    text: `Generated on: ${new Date().toLocaleDateString()}`,
    alignment: AlignmentType.CENTER,
  });
};

const createTable = (data) => {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);
  const rows = [
    new TableRow({
      children: headers.map(header => 
        new TableCell({
          children: [new Paragraph({
            text: header.toUpperCase(),
            alignment: AlignmentType.CENTER,
          })],
        })
      ),
    }),
    ...data.map(row => 
      new TableRow({
        children: headers.map(header => 
          new TableCell({
            children: [new Paragraph({
              text: String(row[header] || ""),
              alignment: AlignmentType.CENTER,
            })],
          })
        ),
      })
    ),
  ];

  return new Table({
    rows,
  });
};

export const exportToWord = async (data, tableName) => {
  if (!data || data.length === 0) {
    console.error("No data to export!");
    return;
  }

  const doc = new Document({
    sections: [{
      children: [
        createHeader(tableName),
        createSubHeader(),
        new Paragraph({}),  // Empty paragraph for spacing
        createTable(data),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${tableName}_Report.docx`);
};
