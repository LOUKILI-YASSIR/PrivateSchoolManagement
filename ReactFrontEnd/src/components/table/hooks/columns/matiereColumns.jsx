import React from "react";
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

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

export const matiereColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.name"),
    accessorKey: "NameMT",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 180,
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.code"),
    accessorKey: "CodeMT",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 180,
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.description"),
    accessorKey: "DescriptionMT",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 220,
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.coefficient"),
    accessorKey: "CoefficientMT",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 280,
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return value !== null && value !== undefined
        ? (
            <Box sx={{ fontWeight: 'bold', color: '#2e7d32', textAlign: 'center', width: '100px' }}>
              {value}
            </Box>
          )
        : renderEmptyCell();
    }  
  },
  {
    header: Traduction("Matiere.max_sessions_per_week"),
    accessorKey: "max_sessions_per_week",
    filterFn: "between", // يسمح بتصفية من - إلى
    filterVariant: "range-slider", // شريط تمرير للفلترة
    columnFilterModeOptions: [...FilterModeOptions["range"]],
    size: 180,
    minSize: 120,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === null || renderedCellValue === undefined) {
        return renderEmptyCell(); // دالة تعرض "-" أو شيء فارغ
      }
  
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: '6px', width: '100%' }}>
          <span style={{ fontWeight: 500 }}>{renderedCellValue}</span>
          <span style={{ color: '#888', fontSize: '0.85em' }}>{Traduction("General.hours")}</span>
        </div>
      );
    }
  },
  {
    header: Traduction("Data.niveau"),
    accessorKey: "niveau_name",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 180,
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
    header: Traduction("Data.evaluationsCount"),
    accessorKey: "total_evaluations",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 280,
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return value !== null && value !== undefined
        ? (
            <Box sx={{ fontWeight: 'bold', color: '#2e7d32', textAlign: 'center', width: '100px' }}>
              {value}
            </Box>
          )
        : renderEmptyCell();
    }
  },
  {
    header: Traduction("Data.gradeRange"), // عنوان العمود
    accessorFn: (row) => ({
      highest: row.highest_note_grade,
      lowest: row.lowest_note_grade,
    }),
    id: "grade_range",
    size: 300,
    enableColumnFilter: false,
    Cell: ({ cell }) => {
      const value = cell.getValue();
    
      if (!value || (!value.highest && !value.lowest)) {
        return renderEmptyCell();
      }
    
      // Helper function to get style based on value
      const getGradeStyle = (val) => {
        if (val < 5) return { bg: '#d32f2f', color: 'white' };
        if (val < 10) return { bg: '#f44336', color: 'white' };
        if (val < 12) return { bg: '#ff9800', color: 'black' };
        if (val < 15) return { bg: '#ffeb3b', color: 'black' };
        if (val < 18) return { bg: '#4caf50', color: 'white' };
        return { bg: '#2e7d32', color: 'white' };
      };
    
      return (
        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {value.highest !== undefined && (
            <Box
              sx={{
                fontWeight: 'bold',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: getGradeStyle(value.highest).bg,
                color: getGradeStyle(value.highest).color,
              }}
            >
              {Traduction("Data.lastNote")} : {value.highest.toFixed(2)}
            </Box>
          )}
          {value.lowest !== undefined && (
            <Box
              sx={{
                fontWeight: 'bold',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: getGradeStyle(value.lowest).bg,
                color: getGradeStyle(value.lowest).color,
              }}
            >
              {Traduction("Data.firstNote")} : {value.lowest.toFixed(2)}
            </Box>
          )}
        </Box>
      );
    }    
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

export const matiereSelectedColumns = {
  Status: {
    label: "Status",
    enable: false,
    columns: {
      "StatutMT": false,
      created_at: false,
      updated_at: false,
    },
  },
  Subject: {
    label: "Subject Information",
    enable: true,
    columns: {
      "NameMT": true,
      "CodeMT": true,
      "DescriptionMT": true,
      "CoefficientMT": true,
    },
  },
  Academic: {
    label: "Academic Information",
    enable: true,
    columns: {
      "niveau_name": true,
      "total_evaluations": true,
    },
  },
  Grades: {
    label: "Grade Information",
    enable: true,
    columns: {
      "grade_range": true,
    },
  },
};
