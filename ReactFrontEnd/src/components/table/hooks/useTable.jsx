import { useContext } from "react";
import { MainContext } from "../../../utils/contexts/MainContext";

export const useTable = () => {
    const ValueMainContext = useContext(MainContext);
    
    const contextValues = ValueMainContext ? {
        data: ValueMainContext.data || [],
        total: ValueMainContext.total || 0,
        isLoading: ValueMainContext.isLoading || false,
        isRefetching: ValueMainContext.isRefetching || false,
        TableName: ValueMainContext.TableName || "",
        refetch: ValueMainContext.refetch || (() => {}),
        setPagination: ValueMainContext.setPagination || (() => {}),
        pagination: ValueMainContext.pagination || { pageIndex: 0, pageSize: 10 },
        setTableData: ValueMainContext.setTableData || (() => {}),
        tableData: ValueMainContext.tableData || []
    } : {
        data: [],
        total: 0,
        isLoading: false,
        isRefetching: false,
        TableName: "",
        refetch: () => {},
        setPagination: () => {},
        pagination: { pageIndex: 0, pageSize: 10 },
        setTableData: () => {},
        tableData: []
    };

    const OnDrowRows = ({ table }) => ({
        onDragEnd: () => {
            const { draggingRow, hoveredRow } = table.getState();
            if (hoveredRow && draggingRow) {
                const newData = [...contextValues.data];
                const [movedRow] = newData.splice(draggingRow.index, 1);
                newData.splice(hoveredRow.index, 0, movedRow);
                contextValues.setTableData(newData);
            }
        },
    });

    return {
        ...contextValues,
        OnDrowRows
    };
};