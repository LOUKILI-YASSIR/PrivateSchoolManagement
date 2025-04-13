import { mkConfig, generateCsv, download } from "export-to-csv";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

export const exportToCsv = (data, tableName) => {
  const config = {
    ...csvConfig,
    filename: tableName,
  };
  const csv = generateCsv(config)(data);
  download(config)(csv);
};
