import { useContext, useCallback } from "react";
import { MainContext } from "../../../utils/contexts/MainContext";

export const useTable = () => {
    const {
        data,
        columns,
        isLoading,
        isRefetching,
        refetch,
        TableName,
        table
    } = useContext(MainContext) || {};

    // Simplified drag/drop handler - Needs API integration for persistence
    const OnDrowRows = useCallback(({ table: dndTable }) => ({
        onDragEnd: () => {
            const { draggingRow, hoveredRow } = dndTable.getState();
            if (hoveredRow && draggingRow) {
                console.warn("Drag and drop detected, but local reordering is disabled for server-side data. Implement API call to persist order.");
            }
        },
    }), []);

    return {
        table: table || null,
        data: data || [],
        columns: columns || [],
        isLoading: isLoading || false,
        isRefetching: isRefetching || false,
        TableName: TableName || "",
        refetch: refetch || (() => {}),
        OnDrowRows
    };
};  