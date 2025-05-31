// hooks/columns/etudiantsColumns.js
import React, { useMemo, useState } from "react";
import { generateCountryOptions, generateCityOptions } from "../../../form/utils/countryUtils";
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import { parsePhoneNumber } from 'libphonenumber-js';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
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
    'BE': 'Belgium',
    'BR': 'Brazil',
    'CA': 'Canada',
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

export const etudiantsColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.image"),
    accessorKey: "user.ProfileFileNamePL",
    enableColumnFilter: false,
    enableColumnFilterModes: false,
    enableFilterMatchHighlighting: false,
    size: 80, // Fixed compact size for image column
    minSize: 150, // Limit max width
    Cell: ({ renderedCellValue, row }) => {
      const user = row.original.user || {};
      const hasUser = !!user;

      const imageUrl = useMemo(() => {
        if (renderedCellValue) {
          return `/uploads/etudiants/${renderedCellValue.replace("/uploads/", "")}?v=${Date.now()}`;
        }
        return "/uploads/default.jpg";
      }, [renderedCellValue]);

      const [hasFailed, setHasFailed] = useState(false);

      if (!hasUser) return renderEmptyCell();

      return (
        <img
          src={hasFailed ? "/uploads/default.jpg" : imageUrl}
          alt="etudiant"
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
    size: 150, // Gender is usually a short text
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
    size: 150, // Names need reasonable width
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
    size: 180, // First names need reasonable width
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.lieunaissance"),
    accessorKey: "user.LieuNaissancePL",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 250, // Place names may be longer
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
    size: 220, // Emails can be quite long
    minSize: 150,
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.telephone"),
    accessorKey: "user.PhoneUT",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 190, // Phone numbers have standard length
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
    size: 200, // Addresses can be long
    minSize: 150,
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
    size: 200, // Increased width for country name
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
  // New columns for group and niveau information
  {
    header: Traduction("Data.group"),
    accessorKey: "group.NameGP",
    filterFn: "equals",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    size: 160, // Group names are typically short
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.niveau"),
    accessorKey: "niveauName",
    filterFn: "equals",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    size: 120, // Increased for hierarchical display
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
  // Replace all separate attendance columns with a single comprehensive column
  {
    header: Traduction("Data.attendance"),
    accessorKey: "attendanceStats",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [...FilterModeOptions["comparison"]],
    size: 320, // Wider column for all attendance info
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
          present: "#4caf50", // Green
          absent: "#f44336",  // Red
          late: "#ff9800",    // Orange/amber
          excused: "#607d8b"  // Blue-gray
        };
        
        let attendanceRating;
        if (presentPercentage >= 90) {
          attendanceRating = {
            label: Traduction("students.attendance.excellent"),
            color: "#4caf50"
          };
        } else if (presentPercentage >= 80) {
          attendanceRating = {
            label: Traduction("students.attendance.good"),
            color: "#8bc34a"
          };
        } else if (presentPercentage >= 70) {
          attendanceRating = {
            label: Traduction("students.attendance.average"),
            color: "#ff9800"
          };
        } else {
          attendanceRating = {
            label: Traduction("students.attendance.poor"),
            color: "#f44336"
          };
        }
        
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
            {/* Status overview with badge */}
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
            
            {/* Stacked progress bar */}
            <div style={{ 
              width: "100%", 
              height: "10px", 
              backgroundColor: "#eee", 
              borderRadius: "5px",
              overflow: "hidden",
              display: "flex"
            }}>
              <div style={{ 
                width: `${presentPercentage}%`, 
                height: "100%", 
                backgroundColor: colorMap.present 
              }} />
              <div style={{ 
                width: `${latePercentage}%`, 
                height: "100%", 
                backgroundColor: colorMap.late 
              }} />
              <div style={{ 
                width: `${excusedPercentage}%`, 
                height: "100%", 
                backgroundColor: colorMap.excused 
              }} />
              <div style={{ 
                width: `${absentPercentage}%`, 
                height: "100%", 
                backgroundColor: colorMap.absent 
              }} />
            </div>
            
            {/* Detailed breakdown */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "6px",
              fontSize: "0.85em"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: colorMap.present 
                }} />
                <span style={{ color: "#333" }}>{Traduction("students.attendance.present")}:</span>
                <span style={{ 
                  marginLeft: "auto", 
                  fontWeight: "500", 
                  color: colorMap.present 
                }}>{presentCount} ({presentPercentage}%)</span>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: colorMap.absent 
                }} />
                <span style={{ color: "#333" }}>{Traduction("students.attendance.absent")}:</span>
                <span style={{ 
                  marginLeft: "auto", 
                  fontWeight: "500", 
                  color: colorMap.absent 
                }}>{absentCount} ({absentPercentage}%)</span>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: colorMap.late 
                }} />
                <span style={{ color: "#333" }}>{Traduction("students.attendance.late")}:</span>
                <span style={{ 
                  marginLeft: "auto", 
                  fontWeight: "500", 
                  color: colorMap.late 
                }}>{lateCount} ({latePercentage}%)</span>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: colorMap.excused 
                }} />
                <span style={{ color: "#333" }}>{Traduction("students.attendance.excused")}:</span>
                <span style={{ 
                  marginLeft: "auto", 
                  fontWeight: "500", 
                  color: colorMap.excused 
                }}>{excusedCount} ({excusedPercentage}%)</span>
              </div>
            </div>
          </div>
        );
      };
      
      // Present count element to be displayed in the cell
      const presentElement = (
        <span
          style={{
            fontWeight: "bold",
            fontSize: "1.1em",
            color: function(presentPercentage){
              let attendanceRating;
              if (presentPercentage >= 90) {
                attendanceRating = {
                  label: Traduction("students.attendance.excellent"),
                  color: "#4caf50"
                };
              } else if (presentPercentage >= 80) {
                attendanceRating = {
                  label: Traduction("students.attendance.good"),
                  color: "#8bc34a"
                };
              } else if (presentPercentage >= 70) {
                attendanceRating = {
                  label: Traduction("students.attendance.average"),
                  color: "#ff9800"
                };
              } else {
                attendanceRating = {
                  label: Traduction("students.attendance.poor"),
                  color: "#f44336"
                };
              }
              return attendanceRating.color;
            }(presentPercentage), // Green for present
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
  // Grade statistics columns
  {
    header: Traduction("Data.finalGrade"),
    accessorKey: "gradeStats.average",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [...FilterModeOptions["comparison"]],
    size: 320, // Wider column for comprehensive grade information
    minSize: 240,
    Cell: ({ renderedCellValue, row }) => {
      const notes = row.original.notes || [];
      
      // If no notes are available, render an empty cell
      if (notes.length === 0) {
        return renderEmptyCell();
      }
    
      const [anchorEl, setAnchorEl] = React.useState(null);
      const [open, setOpen] = React.useState(false);
    
      // Function to determine grade color based on value
      const getColorForGrade = (grade) => {
        if (grade >= 14) return "#4caf50"; // Green
        if (grade >= 10) return "#ff9800"; // Orange
        return "#f44336"; // Red
      };
    
      // Calculate the display grade
      let displayGrade;
      if (row.original.gradeStats && row.original.gradeStats.final > 0) {
        displayGrade = row.original.gradeStats.final;
      } else {
        const sum = notes.reduce((acc, note) => acc + parseFloat(note.GradeNT || 0), 0);
        displayGrade = sum / notes.length;
      }
    
      // Check if detailed stats are available
      const hasStats = row.original.gradeStats && row.original.ranking;
    
      // Handle hover events
      const handleMouseEnter = (event) => {
        if (hasStats) {
          setAnchorEl(event.currentTarget);
          setOpen(true);
        }
      };
    
      const handleMouseLeave = () => {
        setOpen(false);
      };
    
      // Detailed content for the popup
      const detailedContent = () => {
        const groupRank = row.original.ranking?.group || 0;
        const niveauRank = row.original.ranking?.niveau || 0;
        const groupTotal = row.original.ranking?.groupTotal || 0;
        const niveauTotal = row.original.ranking?.niveauTotal || 0;
        const groupPercentile = row.original.ranking?.groupPercentile || 0;
        const niveauPercentile = row.original.ranking?.niveauPercentile || 0;
        const groupHighest = row.original.gradeStats?.groupHighest || 0;
        const groupLowest = row.original.gradeStats?.groupLowest || 0;
        const levelHighest = row.original.gradeStats?.levelHighest || 0;
        const levelLowest = row.original.gradeStats?.levelLowest || 0;
        const firstNote = row.original.gradeStats?.firstNote || 0;
        const lastNote = row.original.gradeStats?.lastNote || 0;
        const gradeStatus = row.original.gradeStats?.status || '';
    
        const getRankBadgeColor = (rank, percentile) => {
          if (rank === 1) return "#FFD700"; // Gold
          if (rank === 2) return "#C0C0C0"; // Silver
          if (rank === 3) return "#CD7F32"; // Bronze
          if (percentile >= 75) return "#4caf50"; // Green
          if (percentile >= 50) return "#2196f3"; // Blue
          if (percentile >= 25) return "#ff9800"; // Orange
          return "#f44336"; // Red
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
            {/* Group Section */}
            <div style={{ fontSize: '0.85em' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Par group:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
                <span>
                  {Traduction("students.grades.firstNote")}: 
                  <b style={{ color: getColorForGrade(firstNote) }}> {firstNote.toFixed(1)}/20</b>
                </span>
                <span>
                  {Traduction("students.grades.lastNote")}: 
                  <b style={{ color: getColorForGrade(lastNote) }}> {lastNote.toFixed(1)}/20</b>
                </span>
              </div>
            </div>
    
            {/* Level Section */}
            <div style={{ fontSize: '0.85em' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Par niveaux:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
                <span>
                  {Traduction("students.grades.firstNote")}: 
                  <b style={{ color: getColorForGrade(levelHighest) }}> {levelHighest.toFixed(1)}/20</b>
                </span>
                <span>
                  {Traduction("students.grades.lastNote")}: 
                  <b style={{ color: getColorForGrade(levelLowest) }}> {levelLowest.toFixed(1)}/20</b>
                </span>
              </div>
            </div>
    
            {/* Ranking Section */}
            <div style={{ fontSize: '0.85em' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Classement:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
                {groupRank > 0 && (
                  <span>
                    {Traduction("students.grades.inGroup")}: 
                    <b style={{ color: getRankBadgeColor(groupRank, groupPercentile), marginLeft: '3px' }}>
                      {groupRank}/{groupTotal}
                    </b>
                  </span>
                )}
                {niveauRank > 0 && (
                  <span>
                    {Traduction("students.grades.inLevel")}: 
                    <b style={{ color: getRankBadgeColor(niveauRank, niveauPercentile), marginLeft: '3px' }}>
                      {niveauRank}/{niveauTotal}
                    </b>
                  </span>
                )}
              </div>
            </div>
    
            {/* Status */}
            {gradeStatus && (
              <div style={{ 
                marginTop: '2px',
                backgroundColor: getColorForGrade(displayGrade),
                color: 'white',
                textAlign: 'center',
                padding: '2px 4px',
                borderRadius: '4px',
                fontSize: '0.85em',
                fontWeight: 'bold'
              }}>
                {Traduction(`students.grades.${gradeStatus}`)}
              </div>
            )}
          </div>
        );
      };
    
      // Grade element to be displayed in the cell
      const gradeElement = (
        <span
          style={{
            fontWeight: "bold",
            fontSize: "1.1em",
            color: getColorForGrade(displayGrade),
            cursor: hasStats ? 'pointer' : 'default',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {displayGrade.toFixed(2)} / 20
        </span>
      );
    
      return (
        <div>
          {gradeElement}
          {hasStats && (
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
          )}
        </div>
      );
    },
  },
  {
    header: Traduction("Data.relationship"),
    accessorKey: "LienParenteTR",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 200, // Relationship descriptions can vary
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.tuteurProfession"),
    accessorKey: "ProfessionTR",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 280, // Profession names can be longer
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.tuteurPhone1"),
    accessorKey: "Phone1TR",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 280, // Phone numbers have standard length
    Cell: ({ renderedCellValue }) => {console.log("Phone1TR",renderedCellValue)
      return renderedCellValue ? <PhoneWithFlag phoneNumber={renderedCellValue} /> : renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.tuteurPhone2"),
    accessorKey: "Phone2TR",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 280, // Phone numbers have standard length
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue ? <PhoneWithFlag phoneNumber={renderedCellValue} /> : renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.tuteurEmail"),
    accessorKey: "EmailTR",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 240, // Email addresses can be long
    minSize: 160,
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
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
export const etudiantsSelectedColumns = {
  Status: {
    label: "Status",
    enable: false,
    columns: {
      "user.StatutUT": false,
      created_at: false,
      updated_at: false,
    },
  },
  Student: {
    label: "Student Information",
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
      "user.PhoneUT": true,
      "user.AdressPL": true,
      "user.PaysPL": true,
      "user.VillePL": true,
    },
  },
  Parent: {
    label: "Parent Information",
    enable: true,
    columns: {
      "LienParenteTR": true,
      "ProfessionTR": true,
      "Phone1TR": true,
      "Phone2TR": true,
      "EmailTR": true,
    },
  },
  Group: {
    label: "Group Information",
    enable: true,
    columns: {
      "groupName": true,
      "niveauName": true,
    },
  },
  Attendance: {
    label: "Attendance Statistics",
    enable: true,
    columns: {
      "attendanceStats": true,
    },
  },
  Grades: {
    label: "Grade Information",
    enable: true,
    columns: {
      "gradeStats.average": true,
    },
  },
};