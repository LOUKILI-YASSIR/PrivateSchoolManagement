import React, { useMemo, useState } from "react";
import { generateCountryOptions, generateCityOptions } from "../../../form/utils/countryUtils";
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';

import { parsePhoneNumber } from 'libphonenumber-js';
import { Box, Popper, Fade, Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faPerson, faPersonDress } from '@fortawesome/free-solid-svg-icons';
// Helper function to handle empty values consistently
const renderEmptyCell = () => <span style={{ color: '#999', fontStyle: 'italic' }}>---</span>;

const PhoneWithFlag = ({ phoneNumber }) => {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    return renderEmptyCell();
  }
  const Flag={}
  try {
    phoneNumber=phoneNumber.replace("-","")
    const parsed = parsePhoneNumber(phoneNumber);
    const country = parsed.country; // e.g. 'MA', 'FR', etc.
    if (!country) return renderEmptyCell();
    Flag.country=country
    // Local flag path in /public
    Flag.flagPath = `/country-flag-icons-3x2/${country}.svg`;

  } catch (error) {
    return renderEmptyCell();
  }

  if (!Flag?.flagPath) return <span>{phoneNumber}</span>;

  return (
    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img
        src={Flag.flagPath}
        alt={Flag.country}
        width={24}
        height={16}
        style={{ borderRadius: "2px", objectFit: "cover" }}
      />
      <span>{phoneNumber}</span>
    </span>
  );
};

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

// Helper function to get full country name from country code
const getFullCountryName = (code) => {
  if (!code) return '';
  
  // Map of common country codes to full names
  const countryMap = {
    'AF': 'Afghanistan',
    'AL': 'Albania',
    'DZ': 'Algeria',
    'AD': 'Andorra',
    'AO': 'Angola',
    'AR': 'Argentina',
    'AU': 'Australia',
    'AT': 'Austria',
    'CN': 'China',
    'DK': 'Denmark',
    'EG': 'Egypt',
    'FR': 'France',
    'DE': 'Germany',
    'GR': 'Greece',
    'IN': 'India',
    'ID': 'Indonesia',
    'IT': 'Italy',
    'JP': 'Japan',
    'MA': 'Morocco',
    'NL': 'Netherlands',
    'NZ': 'New Zealand',
    'NG': 'Nigeria',
    'NO': 'Norway',
    'PK': 'Pakistan',
    'PT': 'Portugal',
    'RU': 'Russia',
    'SA': 'Saudi Arabia',
    'ZA': 'South Africa',
    'ES': 'Spain',
    'SE': 'Sweden',
    'CH': 'Switzerland',
    'TH': 'Thailand',
    'TR': 'Turkey',
    'AE': 'United Arab Emirates',
    'GB': 'United Kingdom',
    'US': 'United States',
    // Add more countries as needed
  };
  
  return countryMap[code] || code;
};

export const professeursColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.image"),
    accessorKey: "user.ProfileFileNamePL",
    enableColumnFilter: false,
    enableColumnFilterModes: false,
    enableFilterMatchHighlighting: false,
    Cell: ({ renderedCellValue }) => {
      const imageUrl = useMemo(() => {
        if (renderedCellValue) {
          return `/uploads/professeurs/${renderedCellValue.replace("/uploads/", "")}?v=${Date.now()}`;
        }
        return "/uploads/default.jpg";
      }, [renderedCellValue]);

      const [hasFailed, setHasFailed] = useState(false);

      return (
        <img
          src={hasFailed ? "/uploads/default.jpg" : imageUrl}
          alt="professeur"
          width="45px"
          height="45px"
          style={{ borderRadius: "50%" }}
          onError={(e) => {
            e.target.onerror = null;
            setHasFailed(true);
          }}
        />
      );
    },
  },
  {
    header: Traduction("Data.genre"),
    accessorKey: "user.GenrePL",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    filterFn: "equals",
    Cell: ({ renderedCellValue }) => {
      if (!renderedCellValue) return renderEmptyCell();
      return (
        <>
          {renderedCellValue === "Homme" ? (
            <ManIcon style={{ color: "#2196f3" }} /> // Blue for Homme
          ) : (
            <WomanIcon style={{ color: "#e91e63" }} /> // Pink for Femme
          )}
          {" "}{renderedCellValue}
        </>
      );
    },
  },
  {
    header: Traduction("Data.nom"),
    accessorKey: "user.NomPL",
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
    header: Traduction("Data.prenom"),
    accessorKey: "user.PrenomPL",
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
  header: Traduction("Professeur.daily_hours_limit"),
  accessorKey: "daily_hours_limit",
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
    header: Traduction("Data.lieunaissance"),
    accessorKey: "user.LieuNaissancePL",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 240,
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.datenaissance"),
    accessorKey: "user.DateNaissancePL",
    filterFn: "greaterThanOrEqualTo",
    filterVariant: "date",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 250, // Date format has fixed width
    Cell: ({ renderedCellValue }) => {
      if (!renderedCellValue) return renderEmptyCell();
      
      const formattedDate = formatDate(renderedCellValue, false);
      return formattedDate || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.nationalite"),
    accessorKey: "user.NationalitePL",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: generateCountryOptions(),
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    size: 220, // Increased width for country name
    minSize: 180,
    Cell: ({ renderedCellValue }) => {
      const flagSrc = useMemo(() => {
        if (!renderedCellValue) return null;
        return `/country-flag-icons-3x2/${renderedCellValue}.svg`;
      }, [renderedCellValue]);

      if (!flagSrc) {
        return renderEmptyCell();
      }

      const fullCountryName = getFullCountryName(renderedCellValue);

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
        <img
          src={flagSrc}
          alt={`${renderedCellValue} flag`}
            width="24"
            height="16"
          onError={(e) => {
            e.target.src = "/country-flag-icons-3x2/MA.svg";
            e.target.alt = "Default flag";
          }}
          style={{ verticalAlign: "middle" }}
        />
          <span style={{ fontWeight: 'medium' }}>
            {fullCountryName}
          </span>
        </div>
      );
    },
  },
  {
    header: Traduction("Data.email"),
    accessorKey: "user.EmailUT",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    id: "phone",
    header: Traduction("Data.telephone"),
    accessorKey: "user.PhoneUT",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 220, // Phone numbers have standard length
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue ? <PhoneWithFlag phoneNumber={renderedCellValue} /> : renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.adresse"),
    accessorKey: "user.AdressPL",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 240,
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.pays"),
    accessorKey: "user.PaysPL",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: generateCountryOptions(),
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    size: 220, // Increased width for country name
    minSize: 180,
    Cell: ({ renderedCellValue }) => {
      const flagSrc = useMemo(() => {
        if (!renderedCellValue) return null;
        return `/country-flag-icons-3x2/${renderedCellValue}.svg`;
      }, [renderedCellValue]);

      if (!flagSrc) {
        return renderEmptyCell();
      }

      const fullCountryName = getFullCountryName(renderedCellValue);

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
        <img
          src={flagSrc}
          alt={`${renderedCellValue} flag`}
            width="24"
            height="16"
          onError={(e) => {
            e.target.src = "/country-flag-icons-3x2/MA.svg";
            e.target.alt = "Default flag";
          }}
          style={{ verticalAlign: "middle" }}
        />
          <span style={{ fontWeight: 'medium' }}>
            {fullCountryName}
          </span>
        </div>
      );
    },
  },
  {
    header: Traduction("Data.ville"),
    accessorKey: "user.VillePL",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: generateCityOptions(),
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    size: 150, // City names can vary in length
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.salaire"),
    accessorKey: "SalairePR",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["equality"],
      ...FilterModeOptions["range"],
    ],    
    size: 200, // City names can vary in length
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue ? (
        <Box sx={{ color: 'green', fontWeight: 'bold' }}>
          {renderedCellValue} DH
        </Box>
      ) : (
        renderEmptyCell()
      );
    },
  
  },
  {
    header: Traduction("Data.cin"),
    accessorKey: "CINPR",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
      ...FilterModeOptions["emptyState"],
    ],
    size: 150,
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2', fontWeight: 'bold' }}>
          <FontAwesomeIcon icon={faIdCard} />
          {renderedCellValue}
        </Box>
      ) : (
        renderEmptyCell()
      );
    },
  },
  {
    header: Traduction("Data.dateEmbauche"),
    accessorKey: "DateEmbauchePR",
    filterFn: "greaterThanOrEqualTo",
    filterVariant: "date",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 250, // Date format has fixed width
    Cell: ({ renderedCellValue }) => {
      if (!renderedCellValue) return renderEmptyCell();
      
      const formattedDate = formatDate(renderedCellValue, false);
      return formattedDate || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.status"),
    accessorKey: "user.StatutUT",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: ["active", "inactive", "offline"],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    size: 180, // Status with icon needs space
    Cell: ({ renderedCellValue }) => {
      // Determine color based on status
      const getStatusColor = (status) => {
        switch(status) {
          case 'active':
            return '#4caf50'; // Green for active/online
          case 'inactive':
            return '#ff9800'; // Orange for inactive
          case 'offline':
          default:
            return '#f44336'; // Red for offline
        }
      };
      
      if (!renderedCellValue) {
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#f44336',
                boxShadow: `0 0 3px #f44336`,
                display: 'inline-block'
              }}
            />
            <span>{renderEmptyCell()}</span>
          </div>
        );
      }
      
      const color = getStatusColor(renderedCellValue);
      const statusText = Traduction(`students.status.${renderedCellValue}`) || renderedCellValue;
      
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 3px ${color}`,
              display: 'inline-block'
            }}
          />
          <span>{statusText}</span>
        </div>
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
        
        const  formattedDate = formatDate(renderedCellValue, true);
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
  {
    header: Traduction("Data.Civilite"),
    accessorKey: "CivilitePR",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
      ...FilterModeOptions["emptyState"],
    ],
    size: 220,
    Cell: ({ renderedCellValue }) => {
      if (!renderedCellValue) return renderEmptyCell();
  
      // تحديد الأيقونة حسب القيمة
      const isMr = renderedCellValue.toLowerCase() === 'm.';
      const icon = isMr ? faPerson : faPersonDress;
  
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: isMr ? '#1565c0' : '#ad1457' }}>
          <FontAwesomeIcon icon={icon} />
          {renderedCellValue}
        </Box>
      );
    },
  },
  {
    header: Traduction("Data.NomBanquePR"),
    accessorKey: "NomBanquePR",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
      ...FilterModeOptions["emptyState"],
    ],
    size: 260,
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.RIBPR"),
    accessorKey: "RIBPR",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
      ...FilterModeOptions["emptyState"],
    ],
    size: 260,
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.NomMatiere"),
    accessorKey: "matiere.NameMT",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
      ...FilterModeOptions["emptyState"],
    ],
    size: 260,
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.CoefficientMatiere"),
    accessorKey: "matiere.CoefficientMT",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
      ...FilterModeOptions["emptyState"],
    ],
    size: 280,
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return value !== null && value !== undefined
        ? (
            <Box sx={{ fontWeight: 'bold', color: '#2e7d32', textAlign: 'center' }}>
              {value}
            </Box>
          )
        : renderEmptyCell();
    }  
  },
  {
    header: Traduction("Data.groupCount"),
    accessorKey: "groups_count",
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
    header: Traduction("Data.attendance"),
    accessorKey: "attendanceStats",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [...FilterModeOptions["comparison"]],
    size: 320,
    minSize: 280,
    Cell: ({ row }) => {
      const stats = row.original.attendanceStats;
      const attendances = row.original.attendances || [];
      
      if (!stats && (!attendances || attendances.length === 0)) {
        return renderEmptyCell();
      }
      
      // Calculate stats if not provided directly
      let total = stats?.total || attendances.length;
      let presentCount = stats?.presentCount || attendances.filter(a => a.StatusAT === "Present").length;
      let absentCount = stats?.absentCount || attendances.filter(a => a.StatusAT === "Absent").length;
      let lateCount = stats?.lateCount || attendances.filter(a => a.StatusAT === "Late").length;
      let excusedCount = stats?.excusedCount || attendances.filter(a => a.StatusAT === "Excused").length;
      
      // Calculate percentages
      let presentPercentage = stats?.presentPercentage || (total > 0 ? Math.round((presentCount / total) * 100) : 0);
      let absentPercentage = stats?.absentPercentage || (total > 0 ? Math.round((absentCount / total) * 100) : 0);
      let latePercentage = stats?.latePercentage || (total > 0 ? Math.round((lateCount / total) * 100) : 0);
      let excusedPercentage = stats?.excusedPercentage || (total > 0 ? Math.round((excusedCount / total) * 100) : 0);
      
      const [anchorEl, setAnchorEl] = React.useState(null);
      const [open, setOpen] = React.useState(false);
      
      // Function to determine attendance rating
      const getAttendanceRating = (percentage) => {
        if (percentage >= 90) {
          return { label: Traduction("students.attendance.excellent"), color: "#4caf50" };
        } else if (percentage >= 80) {
          return { label: Traduction("students.attendance.good"), color: "#8bc34a" };
        } else if (percentage >= 70) {
          return { label: Traduction("students.attendance.average"), color: "#ff9800" };
        } else {
          return { label: Traduction("students.attendance.poor"), color: "#f44336" };
        }
      };
      
      const attendanceRating = getAttendanceRating(presentPercentage);
      
      // Handle hover events
      const handleMouseEnter = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
      };
      
      const handleMouseLeave = () => {
        setOpen(false);
      };
      
      // Detailed content for the popup
      const detailedContent = () => {
        const colorMap = {
          present: "#4caf50",
          absent: "#f44336",
          late: "#ff9800",
          excused: "#607d8b"
        };
        
        return (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '6px', 
            padding: '4px',
            backgroundColor: '#f8f8f8',
            borderRadius: '8px',
            border: '1px solid #e0e0e0' 
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ 
                  fontSize: "1.1em", 
                  fontWeight: "bold",
                  color: attendanceRating.color
                }}>
                  {presentPercentage}%
                </span>
                <span style={{ 
                  backgroundColor: attendanceRating.color,
                  color: "#fff",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  fontSize: "0.7em",
                  fontWeight: "bold",
                  whiteSpace: "nowrap"
                }}>
                  {attendanceRating.label}
                </span>
              </div>
              <span style={{ 
                fontSize: "0.75rem", 
                color: "#666",
                fontWeight: "medium"
              }}>
                {total} {Traduction("students.attendance.sessions")}
              </span>
            </div>
            
            <div style={{ 
              width: "100%", 
              height: "10px", 
              backgroundColor: "#eee", 
              borderRadius: "5px",
              overflow: "hidden",
              display: "flex"
            }}>
              <div style={{ width: `${presentPercentage}%`, height: "100%", backgroundColor: colorMap.present }} />
              <div style={{ width: `${latePercentage}%`, height: "100%", backgroundColor: colorMap.late }} />
              <div style={{ width: `${excusedPercentage}%`, height: "100%", backgroundColor: colorMap.excused }} />
              <div style={{ width: `${absentPercentage}%`, height: "100%", backgroundColor: colorMap.absent }} />
            </div>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "6px",
              fontSize: "0.85em"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: colorMap.present }} />
                <span style={{ color: "#333" }}>{Traduction("students.attendance.present")}:</span>
                <span style={{ marginLeft: "auto", fontWeight: "500", color: colorMap.present }}>
                  {presentCount} ({presentPercentage}%)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: colorMap.absent }} />
                <span style={{ color: "#333" }}>{Traduction("students.attendance.absent")}:</span>
                <span style={{ marginLeft: "auto", fontWeight: "500", color: colorMap.absent }}>
                  {absentCount} ({absentPercentage}%)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: colorMap.late }} />
                <span style={{ color: "#333" }}>{Traduction("students.attendance.late")}:</span>
                <span style={{ marginLeft: "auto", fontWeight: "500", color: colorMap.late }}>
                  {lateCount} ({latePercentage}%)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: colorMap.excused }} />
                <span style={{ color: "#333" }}>{Traduction("students.attendance.excused")}:</span>
                <span style={{ marginLeft: "auto", fontWeight: "500", color: colorMap.excused }}>
                  {excusedCount} ({excusedPercentage}%)
                </span>
              </div>
            </div>
          </div>
        );
      };
      
      // Present percentage element to be displayed in the cell
      const presentElement = (
        <span
          style={{
            fontWeight: "bold",
            fontSize: "1.1em",
            color: attendanceRating.color,
            cursor: 'pointer',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {presentPercentage}%
        </span>
      );
      
      return (
        <div>
          {presentElement}
          <Popper
            open={open}
            anchorEl={anchorEl}
            placement="top"
            transition
            sx={{ zIndex: 1200 }}
            modifiers={[
              {
                name: 'offset',
                options: {
                  offset: [0, 10],
                },
              },
            ]}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  {detailedContent()}
                </Paper>
              </Fade>
            )}
          </Popper>
        </div>
      );
    },
  },
  {
    header: Traduction("Data.TotalVacationDays"),
    accessorKey: "teacherVocations.TotalJours",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
      ...FilterModeOptions["emptyState"],
    ],
    size: 280,
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return value !== null && value !== undefined
        ? (
            <Box sx={{ fontWeight: 'bold', color: '#1565c0', textAlign: 'center' }}>
              {value}
            </Box>
          )
        : renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.VacationOccurrences"),
    accessorKey: "teacherVocations.NombreConges",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
      ...FilterModeOptions["emptyState"],
    ],
    size: 300,
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return value !== null && value !== undefined
        ? (
            <Box sx={{ fontWeight: 'bold', color: '#2e7d32', textAlign: 'center' }}>
              {value}
            </Box>
          )
        : renderEmptyCell();
    },
  }
    
];

export const professeursSelectedColumns = {
  Status: {
    label: "Status",
    enable: false,
    columns: {
      "user.StatutUT": false,
      created_at: false,
      updated_at: false,
    },
  },
  Professor: {
    label: "Professor Information",
    enable: true,
    columns: {
      "user.ProfileFileNamePL": true,
      "user.GenrePL": true,
      "user.NomPL": true,
      "user.PrenomPL": true,
      "user.LieuNaissancePL": true,
      "user.DateNaissancePL": true,
      "user.NationalitePL": true,
      "user.EmailUT": true,
      "user.PhoneUT":true,
      "user.AdressPL": true,
      "user.PaysPL": true,
      "user.VillePL": true,
    },
  },
  Professional: {
    label: "Professional Information",
    enable: true,
    columns: {
      "SalairePR": true,
      "CINPR": true,
      "DateEmbauchePR": true,
      "CivilitePR": true,
      "NomBanquePR": true,
      "RIBPR": true,
    },
  },
  Academic: {
    label: "Academic Information",
    enable: true,
    columns: {
      "matiere.NameMT": true,
      "matiere.CoefficientMT": true,
      "attendanceStats": true,
      "teacherVocations.TotalJours": true,
      "teacherVocations.NombreConges": true,
    },
  },
};
