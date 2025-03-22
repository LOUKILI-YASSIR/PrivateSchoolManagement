import { useContext, useEffect } from "react";
import { MainContext } from "../../../utils/contexts/MainContext";

export const UseTableHead = (Table, handleDelete) => {
    const ValueMainContext = useContext(MainContext);
    const { setTableData } = useContext(MainContext)
    useEffect(()=>{
        setTableData(Table)
    },[Table])
    if(!!ValueMainContext) var { TableName } = ValueMainContext
    const ID_OF = {
        etudiants : "matriculeEt",
        professeurs : "matriculePr",
    }[TableName]
    return {
        DeleteSelected: (rows) => {
            if (!rows) return;
            rows.forEach(row => {
                handleDelete(row.original[ID_OF]);
            });
            setTimeout(() => Table.resetRowSelection(), 2000 * rows.length);
        },
    };
};
