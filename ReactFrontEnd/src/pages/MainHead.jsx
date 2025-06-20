import ActionMenu from "../components/menu/ActionMenu";
import Export from "../components/export/Export";
import { BoxOptions } from "../components/export/options/ExportOption";
import { UseExport } from "../components/export/hooks/useExport";
import { MainContext } from "../utils/contexts/MainContext";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport, faDownload } from "@fortawesome/free-solid-svg-icons";

export default function Head ( {userRole}) {
    const { data, TableName } = useContext(MainContext);
    const { fileExtension, IndexExportType } = useSelector(state=>state.Export);
    const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
    const { t:Traduction } = useTranslation();
    const { ClickToExport } = UseExport();
    const [isExporting, setIsExporting] = useState(false);
    
    // Common button style
    const getButtonStyle = (isActive) => ({
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)',
        color: '#fff',
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 500,
        padding: '6px 12px',
        fontSize: '0.85rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: 'none',
        marginRight: '8px',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
        '&:disabled': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.4)',
        },
    });
    
    // Handle quick export without opening dialog
    const handleQuickExport = (e) => {
        e.stopPropagation(); // Prevent dialog from opening
        setIsExporting(true);
        
        try {
            // Default options for attendance and grades
            const defaultOptions = {
                attendance: {
                    present: true,
                    absent: true,
                    late: true,
                    excused: true
                },
                grades: {
                    finalGrade: true
                }
            };
            
            // Use selected columns from Redux store
            const success = ClickToExport(defaultOptions);
            
            // Add animation effect to button
            if (success) {
                setTimeout(() => {
                    setIsExporting(false);
                }, 1500);
            } else {
                setIsExporting(false);
            }
        } catch (error) {
            console.error("Export error:", error);
            setIsExporting(false);
        }
    };
    
    // Get file format icon
    const getFileIcon = () => {
        switch(fileExtension.toLowerCase()) {
            case 'pdf':
                return 'pdf';
            case 'excel':
                return 'excel';
            case 'csv':
                return 'csv';
            default:
                return 'file';
        }
    };
    
    return (
        <div 
          className={`cardHeader text-white h-20 flex items-center p-6 rounded-xl justify-between`}
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#2a2185',
            color: '#fff',
            transition: 'all 0.3s ease',
          }}
        >
          <div className="h4">{Traduction(`${TableName}.list`)}</div>
          { userRole === "admin" && (
<div className="flex items-center gap-2">
              <Tooltip title={Traduction("actions.quickExport", "Quick Export")}>
                  <span>
                      <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={!data || data.length === 0 || isExporting}
                          onClick={handleQuickExport}
                          className={`quick-export-btn ${isExporting ? 'exporting' : ''}`}
                          sx={getButtonStyle(isExporting)}
                      >
                          <FontAwesomeIcon 
                              icon={isExporting ? faDownload : faFileExport}
                              className={`mr-2 ${isExporting ? 'animate-bounce' : ''}`}
                          />
                          {isExporting ? Traduction("actions.exporting", "Exporting...") : Traduction("actions.exportTo", { type: fileExtension.toUpperCase() })}
                      </Button>
                  </span>
              </Tooltip>
              
              <ActionMenu 
                DialogContentComponent={<Export/>}
                contentOptions={
                  BoxOptions(
                    { IndexExportType, fileExtension, data, ClickToExport }
                  )
                }
                maxWidth="lg"
                fullWidth
                className="export-dialog"
              />
          </div>
          )}
        </div>
    );
}
 