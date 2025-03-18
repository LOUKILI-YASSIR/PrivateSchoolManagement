import { UseHead } from "./hooks/useMainHead";
import ActionMenu from "../../components/menu/ActionMenu";
import Export from "../../components/export/Export";
import { BoxOptions } from "../../components/export/options/ExportOption";
import { UseExport } from "../../components/export/hooks/useExport";
export default function Head () {
    const { fileExtension, IndexExportType, data, Traduction, TableName } = UseHead();
    const { ClickToExport } = UseExport();
    return (
        <div className="cardHeader bg-[#2a2185] text-white h-20 flex items-center p-6 rounded-xl justify-between">
          <div className="h4">{Traduction(`${TableName}.list`)}</div>
          <ActionMenu 
            DialogContentComponent={<Export/>}
            contentOptions={
              BoxOptions(
                { IndexExportType, fileExtension, data, ClickToExport }
              )
            }
          />  
        </div>
    );
}
 