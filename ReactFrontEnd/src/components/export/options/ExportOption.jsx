import { faFileExport } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Tooltip } from "@mui/material"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { getActionButtonStyle, getIconButtonStyle } from '../../../components/Menu/styles/actionMenuStyles';

export const ExportOptions = () => {
  const {t:Traduction} = useTranslation()
  return {
    AllFilesExtantions : [
      "Csv",
      "Excel",
      "Pdf",
      "Word",
    ],
    OptionsExportFile :  [
      {
        text: Traduction("export.exportAllData"),
        onClick: (handleExportData) => handleExportData(),
        disabled: (tableData)=>false,
      },
      {
        text: Traduction("export.exportAllRows"),
        onClick: (handleExportRows) => handleExportRows(),
        disabled: (tableData) => tableData.getPrePaginationRowModel().rows?.length === 0,
      },
      {
        text: Traduction("export.exportPageRows"),
        onClick: (handleExportRows) => handleExportRows(),
        disabled: (tableData) => tableData.getRowModel().rows?.length === 0,
      },
      {
        text: Traduction("export.exportSelectedRows"),
        onClick: (handleExportRows) => handleExportRows(),
        disabled: (tableData) => !tableData.getIsSomeRowsSelected() && !tableData.getIsAllRowsSelected(),
      },

    ],
    ExportSelectText : Traduction("export.exportTo"),
    ExportMainText : Traduction("actions.export"),
    ExportTypeText : Traduction("export.exportType"),
    Traduction: (text) => Traduction(text)
  }
}

export const BoxOptions = (Options) => {
    const { OptionsExportFile, ExportMainText, Traduction } = ExportOptions()
    const { data, fileExtension, IndexExportType, ClickToExport } = Options
    const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
    
    // Get custom styles for export button
    const getExportButtonStyle = () => {
      const baseIconStyle = getActionButtonStyle('info', isDarkMode, !data || !data[0]);
      
      return {
        ...baseIconStyle,
        display: 'flex',
        alignItems: 'center',
        textTransform: 'none',
        borderRadius: '8px',
        padding: '8px 16px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontSize: '0.9rem',
        fontWeight: 500,
        position: 'relative',
        overflow: 'hidden',
      };
    };
    
    return {
        Title: `${OptionsExportFile[IndexExportType].text} (${fileExtension})`,
        MainBtn: ({ClickToOpen}) => (
          <Tooltip title={data && data[0] ? ExportMainText : Traduction("export.noDataToExport")}>
            <span style={{ display: 'inline-block', position: 'relative' }}>
              <Button
                disabled={!data || !data[0]}
                variant="contained"
                onClick={() => ClickToOpen()}
                sx={getExportButtonStyle()}
              >
                <FontAwesomeIcon 
                  icon={faFileExport} 
                  style={{ 
                    marginRight: '8px', 
                    fontSize: '1.1rem',
                    transition: 'transform 0.3s ease',
                  }} 
                  className="export-icon"
                />
                {ExportMainText}
                {!data || !data[0] ? (
                  <span style={{
                    position: 'absolute',
                    fontSize: '10px',
                    bottom: '2px',
                    right: '5px',
                    opacity: 0.7,
                  }}>
                    No data
                  </span>
                ) : null}
              </Button>
            </span>
          </Tooltip>
        ),
        Btns: [
            {
                handleClose: true,
                disabled: false,
                value: Traduction("actions.cancel"),
                style: getActionButtonStyle('default', isDarkMode)
            },
            {
                handleClose: true,
                handleClick: () => ClickToExport(),
                disabled: false,
                value: Traduction("actions.export"),
                style: getActionButtonStyle('info', isDarkMode)
            }
        ]
    }
}