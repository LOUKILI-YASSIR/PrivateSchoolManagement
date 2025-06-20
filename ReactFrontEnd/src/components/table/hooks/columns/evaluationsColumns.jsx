import React from "react";
import { Box } from "@mui/material";
// Provided helper functions
const renderEmptyCell = () => (
  <span style={{ color: "#999", fontStyle: "italic" }}>---</span>
);

const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let formattedDate = `${year}-${month}-${day}`;

    if (includeTime) { 
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      formattedDate += ` ${hours}:${minutes}:${seconds}`;
    }

    return formattedDate;
  } catch (e) {
    return dateString;
  }
};

export const evaluationsColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.evaluationType"),
    accessorKey: "NameEP",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 240,
    Cell: ({ cell }) => cell.getValue() || renderEmptyCell(),
  },
  {
    header: Traduction("Data.CodeEvaluation"),
    accessorKey: "CodeEP",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 280,
    Cell: ({ cell }) => cell.getValue() || renderEmptyCell(),
  },
  {
    header: Traduction("Data.descriptionEvaluation"),
    accessorKey: "DescriptionEP",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 340,
    Cell: ({ cell }) => cell.getValue() || renderEmptyCell(),
  },
    {
      header: Traduction("Data.matieresCount"),
      accessorKey: "evaluations_count",
      filterFn: "greaterThanOrEqualTo",
      columnFilterModeOptions: [
        ...FilterModeOptions["comparison"],
        ...FilterModeOptions["range"],
      ],
      size: 260,
      Cell: ({ cell }) => {
        const count = cell.getValue() ?? 0;
        return (
          <Box sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: count > 0 ? '#1976d2' : '#999',
          }}>
            {count}
          </Box>
        );
      },
    },
  {
    header: Traduction("Data.createdAt"),
    accessorKey: "created_at",
    size: 180,
    Cell: ({ cell }) => {
      const val = formatDate(cell.getValue(), true);
      return val || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.updatedAt"),
    accessorKey: "updated_at",
    size: 180,
    Cell: ({ cell }) => {
      const val = formatDate(cell.getValue(), true);
      return val || renderEmptyCell();
    },
  },
];

export const evaluationsSelectedColumns = {
  Status: {
    label: "Status",
    enable: false,
    columns: {
      "StatutEV": false,
      created_at: false,
      updated_at: false,
    },
  },
  Evaluation: {
    label: "Evaluation Information",
    enable: true,
    columns: {
      "matiere.NameMT": true,
      "evaluation_type.NameEP": true,
      "NbrEV": true,
    },
  },
  Academic: {
    label: "Academic Information",
    enable: true,
    columns: {
      "niveau_name": true,
      "min_grade": true,
      "max_grade": true,
    },
  },
  Schedule: {
    label: "Schedule Information",
    enable: true,
    columns: {
      "DateEV": true,
      "DureeEV": true,
      "HeureDebutEV": true,
    },
  },
};
