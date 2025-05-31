import { 
  MdCheckCircle,       // متاح
  MdDoNotDisturb,      // مشغول
  MdEventAvailable,    // محجوز
  MdBuild,             // صيانة
  MdBlock,             // مغلق
  MdCleaningServices,  // تنظيف
  MdAssignment,        // وضع امتحان
  MdEvent,             // فعالية
  MdHelpOutline        // غير مخصصة
} from "react-icons/md";import React from "react";
import { Box } from "@mui/material";

// عرض النص الفارغ بشكل افتراضي
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
export const sallesColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.name"),
    accessorKey: "NameSL",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 160,
    Cell: ({ cell }) => cell.getValue() ?? renderEmptyCell(),
  },
  {
    header: Traduction("Data.capacity"),
    accessorKey: "CapacitySL",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 200,
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return (
        <Box sx={{ textAlign: 'center', fontWeight: 'bold', color: '#2e7d32' }}>
          {value ?? renderEmptyCell()}
        </Box>
      );
    },
  },
  {
    header: Traduction("Data.location"),
    accessorKey: "LocationSL",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 220,
    Cell: ({ cell }) => cell.getValue() ?? renderEmptyCell(),
  },
  {
    header: Traduction("Data.resources"),
    accessorKey: "RessourcesSL",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 200,
    Cell: ({ cell }) => cell.getValue() ?? renderEmptyCell(),
  },
  {
    header: Traduction("Data.type"),
    accessorKey: "TypeSL",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: ["classroom", "lab", "auditorium", "other"],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    size: 180,
    Cell: ({ cell }) => cell.getValue() ?? renderEmptyCell(),
  },
  {
    header: Traduction("Data.status"),
    accessorKey: "StatusSL",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: [
      "disponible",
      "occupée",
      "réservée",
      "en_maintenance",
      "fermée",
      "en_nettoyage",
      "mode_examen",
      "événement",
      "non_attribuée"
    ],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    size: 180,
    Cell: ({ renderedCellValue }) => {
      if (!renderedCellValue) return renderEmptyCell();
    
      // أيقونة لكل حالة
      const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
          case 'disponible':
            return <MdCheckCircle color="#4caf50" />;
          case 'occupée':
            return <MdDoNotDisturb color="#f44336" />;
          case 'réservée':
            return <MdEventAvailable color="#ff9800" />;
          case 'en_maintenance':
            return <MdBuild color="#9e9e9e" />;
          case 'fermée':
            return <MdBlock color="#616161" />;
          case 'en_nettoyage':
            return <MdCleaningServices color="#03a9f4" />;
          case 'mode_examen':
            return <MdAssignment color="#673ab7" />;
          case 'événement':
            return <MdEvent color="#ff5722" />;
          case 'non_attribuée':
            return <MdHelpOutline color="#bdbdbd" />;
          default:
            return <MdHelpOutline color="#000000" />;
        }
      };
    
      // لون الدائرة نفسها (نفس اللون المستخدم في الأيقونة)
      const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
          case 'disponible':
            return '#4caf50';  // أخضر
          case 'occupée':
            return '#f44336';  // أحمر
          case 'réservée':
            return '#ff9800';  // برتقالي
          case 'en_maintenance':
            return '#9e9e9e';  // رمادي
          case 'fermée':
            return '#616161';  // رمادي غامق
          case 'en_nettoyage':
            return '#03a9f4';  // أزرق فاتح
          case 'mode_examen':
            return '#673ab7';  // بنفسجي
          case 'événement':
            return '#ff5722';  // برتقالي داكن
          case 'non_attribuée':
            return '#bdbdbd';  // رمادي فاتح
          default:
            return '#000000';  // أسود افتراضي
        }
      };
    
      const color = getStatusColor(renderedCellValue);
      const icon = getStatusIcon(renderedCellValue);
    
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 3px ${color}`,
              display: 'inline-block',
            }}
          />
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {icon}
            {renderedCellValue}
          </span>
        </div>
      );
    },
  },
  {
    header: Traduction("Data.floor"),
    accessorKey: "FloorSL",
    filterFn: "equals",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    size: 160,
    Cell: ({ cell }) => cell.getValue() ?? renderEmptyCell(),
  },
  {
    header: Traduction("Data.observation"),
    accessorKey: "ObservationSL",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 220,
    Cell: ({ cell }) => cell.getValue() ?? renderEmptyCell(),
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

export const sallesSelectedColumns = {
  Status: {
    label: "Status",
    enable: false,
    columns: {
      "StatusSL": false,
      created_at: false,
      updated_at: false,
    },
  },
  Room: {
    label: "Room Information",
    enable: true,
    columns: {
      "NameSL": true,
      "CapacitySL": true,
      "TypeSL": true,
    },
  },
  Location: {
    label: "Location Information",
    enable: true,
    columns: {
      "LocationSL": true,
      "FloorSL": true,
    },
  },
  Equipment: {
    label: "Equipment Information",
    enable: true,
    columns: {
      "RessourcesSL": true,
      "ObservationSL": true,
    },
  },
};
