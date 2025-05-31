import React from "react";
import { Box } from "@mui/material";

const renderEmptyCell = () => (
  <span style={{ color: '#999', fontStyle: 'italic' }}>---</span>
);
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
export const groupColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.name"),
    accessorKey: "NameGP",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 160,
    Cell: ({ cell }) => cell.getValue() ?? renderEmptyCell(),
  },
  {
    header: Traduction("Data.description"),
    accessorKey: "DescriptionGP",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 220,
    Cell: ({ cell }) => cell.getValue() ?? renderEmptyCell(),
  },
  {
    header: Traduction("Data.niveau"),
    accessorKey: "niveau.NomNV",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    minSize: 180,
    Cell: ({ renderedCellValue }) => {
      if (!renderedCellValue) return renderEmptyCell();
      
      // Check if this is a hierarchical niveau display (contains parentheses)
      const hasSubNiveau = renderedCellValue.includes('(') && renderedCellValue.includes(')');
      
      if (hasSubNiveau) {
        // Extract parent and sub-niveau parts
        const parentNiveau = renderedCellValue.split('(')[0].trim();
        const subNiveau = renderedCellValue.match(/\(([^)]+)\)/)[1].trim();
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 'bold' }}>{parentNiveau}</span>
            <span style={{ 
              fontSize: '0.85rem', 
              color: '#666',
              marginTop: '2px',
              fontStyle: 'italic'
            }}>
              &rarr; {subNiveau}
            </span>
          </div>
        );
      }
      
      // Regular niveau display
      return (
        <span style={{ fontWeight: 'medium' }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.studentsCount"),
    accessorKey: "etudiants_count",
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
    header: Traduction("Data.professeurCount"),
    accessorKey: "professeurs_count",
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

export const groupSelectedColumns = {
  Status: {
    label: "Status",
    enable: false,
    columns: {
      created_at: false,
      updated_at: false,
    },
  },
  Group: {
    label: "Group Information",
    enable: true,
    columns: {
      "NameGP": true,
      "DescriptionGP": true,
    },
  },
  Academic: {
    label: "Academic Information",
    enable: true,
    columns: {
      "niveau.NomNV": true,
      "etudiants_count": true,
    },
  },
  Schedule: {
    label: "Schedule Information",
    enable: true,
    columns: {
      "HoraireGP": true,
      "JoursCoursGP": true,
    },
  },
};
