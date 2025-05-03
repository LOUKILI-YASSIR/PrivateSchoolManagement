import { useContext } from "react";
import { MainContext } from "../../../utils/contexts/MainContext";

export const UseTableHead = (Table, handleDelete) => {
    const ValueMainContext = useContext(MainContext);
    const TableName = ValueMainContext?.TableName;
    
    const ID_OF = {
        etudiants : "MatriculeET",
        professeurs : "MatriculePR",
    }[TableName];

    return {
        DeleteSelected: (rows) => {
            if (!rows || !ID_OF) return;
            rows.forEach(row => {
                handleDelete(row.original[ID_OF]);
            });
            setTimeout(() => Table.resetRowSelection(), 2000 * rows.length);
        },
    };
};
