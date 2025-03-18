import { useSelector } from "react-redux"
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { MainContext } from "../contexts/MainContext";
const UseHead = () => {
    const { data, TableName } = useContext(MainContext);
    const { fileExtension, IndexExportType } = useSelector(state=>state.Export)
    const { t:Traduction } = useTranslation()
    return {
        fileExtension, IndexExportType,
        data, TableName, Traduction
    }
  } 
  
  export {UseHead}
