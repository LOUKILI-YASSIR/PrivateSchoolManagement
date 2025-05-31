import React from "react";
import { Box } from "@mui/material";

// Helper function to handle empty values consistently
const renderEmptyCell = () => <span style={{ color: '#999', fontStyle: 'italic' }}>---</span>;
// Helper function to format ISO date string with configurable format options
const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid
    
    // Format date part: YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Date only format
    let formattedDate = `${year}-${month}-${day}`;
    
    // Add time if requested
    if (includeTime) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      formattedDate += ` ${hours}:${minutes}:${seconds}`;
    }
    
    return formattedDate;
  } catch (e) {
    return dateString; // Return original on error
  }
};

export const niveauxColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.code"),
    accessorKey: "CodeNV",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 180,
    Cell: ({ cell }) => cell.getValue() ?? renderEmptyCell(),
  },
  {
    header: Traduction("Data.name"),
    accessorKey: "NomNV",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 180,
    Cell: ({ cell }) => cell.getValue() ?? renderEmptyCell(),
  },
  {
    header: Traduction("Data.description"),
    accessorKey: "DescriptionNV",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 220,
    Cell: ({ cell }) => cell.getValue() ?? renderEmptyCell(),
  },
  {
    header: Traduction("Data.groupsCount"),
    accessorKey: "groups_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 260,
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return (
        <Box sx={{ textAlign: 'center', fontWeight: 'bold', color: '#6a1b9a' }}>
          {value ?? renderEmptyCell()}
        </Box>
      );
    },
  },
  {
    header: Traduction("Data.matieresCount"),
    accessorKey: "matieres_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 260,
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return (
        <Box sx={{ textAlign: 'center', fontWeight: 'bold', color: '#2e7d32' }}>
          {value ?? renderEmptyCell()}
        </Box>
      );
    },
  },
    // Update for createdAt field if it exists in the data
    {
      header: Traduction("Data.createdAt"),
      accessorKey: "created_at",
      filterFn: "greaterThanOrEqualTo",
      filterVariant: "date",
      columnFilterModeOptions: [
        ...FilterModeOptions["comparison"],
        ...FilterModeOptions["range"],
      ],
      size: 250, 
      Cell: ({ renderedCellValue }) => {
        if (!renderedCellValue) return renderEmptyCell();
        
        const formattedDate = formatDate(renderedCellValue, true);
        return formattedDate || renderEmptyCell();
      },
    },
    
    // Update for updatedAt field if it exists in the data
    {
      header: Traduction("Data.updatedAt"),
      accessorKey: "updated_at",
      filterFn: "greaterThanOrEqualTo",
      filterVariant: "date",
      columnFilterModeOptions: [
        ...FilterModeOptions["comparison"],
        ...FilterModeOptions["range"],
      ],
      size: 250,
      Cell: ({ renderedCellValue }) => {
        if (!renderedCellValue) return renderEmptyCell();
        
        const formattedDate = formatDate(renderedCellValue, true);
        return formattedDate || renderEmptyCell();
      },
    },
];

export const niveauxSelectedColumns = {
  Status: {
    label: "Status",
    enable: false,
    columns: {
      created_at: false,
      updated_at: false,
    },
  },
  Level: {
    label: "Level Information",
    enable: true,
    columns: {
      "CodeNV": true,
      "NomNV": true,
      "TypeNV": true,
      "DescriptionNV": true,
    },
  },
  Academic: {
    label: "Academic Information",
    enable: true,
    columns: {
      "parent.NomNV": true,
      "children_count": true,
      "groups_count": true,
      "matieres_count": true,
    },
  },
  Schedule: {
    label: "Schedule Information",
    enable: true,
    columns: {
      "HeureDebutNV": true,
      "HeureFinNV": true,
    },
  },
};
