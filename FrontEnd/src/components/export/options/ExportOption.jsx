import { faFileExport } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "@mui/material"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"
export const ExportOptions = () => {
  const {t:Traduction} = useTranslation()
  return {
    AllFilesExtantions : [
      "Csv",
      "Excel",
      "Pdf",
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

export const BoxOptions = (Options)=>{
    const { OptionsExportFile, ExportMainText, Traduction } = ExportOptions()
    const { data, fileExtension, IndexExportType, ClickToExport } = Options
    return {
        Title : `${OptionsExportFile[IndexExportType].text} (${fileExtension})`,
        MainBtn : ({ClickToOpen}) => (
          <Button
            disabled = {!data || !data[0]}
            className = "bg-white text-[#2a2185] flex justify-between fs-6 p-2 px-3 Export"
            onClick={()=> ClickToOpen()}
          >
            <Fragment>
              <FontAwesomeIcon className="block pr-2" icon={faFileExport}/>
              <div>{ExportMainText}</div>
            </Fragment>
          </Button>
        ),
        Btns: [
            {
                handleClose : true,
                disabled : false,
                className : "",
                value : Traduction("actions.cancel")
            },
            {
                handleClose : true,
                handleClick : ()=>ClickToExport(),
                disabled : false,
                className : "",
                value : Traduction("actions.export")
            }
        ]
    }
}
