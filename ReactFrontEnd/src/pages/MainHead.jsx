import ActionMenu from "../components/Menu/ActionMenu";
import Export from "../components/export/Export";
import { BoxOptions } from "../components/export/options/ExportOption";
import { UseExport } from "../components/export/hooks/useExport";
import { MainContext } from "../utils/contexts/MainContext";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
export default function Head () {
    const { data, TableName } = useContext(MainContext);
    const { fileExtension, IndexExportType } = useSelector(state=>state.Export)
    const { t:Traduction } = useTranslation()
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
 