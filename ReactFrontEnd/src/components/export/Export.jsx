import { 
    Select,Box,InputLabel,OutlinedInput,FormControl,
} from "@mui/material";
import { SetExportInfo } from "./hooks/useExport";
import { ExportOptions } from "./options/ExportOption";
export default function Export() {
    const { tableData, IndexExportType, fileExtension, SelectFileExtention, SelectIndexExportType } = SetExportInfo()
    const { ExportSelectText, AllFilesExtantions, ExportTypeText, OptionsExportFile } = ExportOptions()
    return (
        <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel htmlFor="FileExtention">{ExportSelectText}</InputLabel>
            <Select
              native
              value={fileExtension}
              onChange={SelectFileExtention}
              input={<OutlinedInput label="FileExtentionSelect" id="FileExtention" />}
            >
              {
                AllFilesExtantions.map((Extentions,index)=>{
                  return(
                    <option key={index} value={Extentions}>{Extentions}</option>
                )})
              }
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel htmlFor="OptionExportFile">{ExportTypeText}</InputLabel>
            <Select
              native
              value={IndexExportType}
              onChange={SelectIndexExportType}
              input={<OutlinedInput label="OptionExportFileSelect" id="OptionExportFile" />}
            > 
             {
                OptionsExportFile.map((ExportType,index)=>(
                  ( !!ExportType.disabled && !ExportType.disabled(tableData) ) && (
                    <option key={index} value={index} >{ExportType.text}</option>
                  )
                ))
             }
            </Select>
          </FormControl>
        </Box> 
  )
}
