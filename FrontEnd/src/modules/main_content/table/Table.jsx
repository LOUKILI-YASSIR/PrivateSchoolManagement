import { MaterialReactTable } from "material-react-table";
import TableHead from "./TableHead.jsx";
import { GetInfoTable } from "./options/TableOption.jsx";
import { useTable } from "./hooks/useTable.jsx";
import { useColumns } from "./hooks/useColumn.jsx";
import { useHandlesData } from "./hooks/useData.jsx";
import { getActionOptionsMenu } from "./options/TableActionMenuOption.jsx";

export const TableTemplate = () => {
    const {
        data,
        total,
        isLoading,
        isRefetching,
        refetch,
        TableName,
        setPagination,
        pagination,
        OnDrowRows
    } = useTable();
    
    const { ActionOption, LanguageOption, TableOptions } = GetInfoTable(TableName);
    const columns = useColumns(data, TableName);
    const Handels = useHandlesData(TableName);
    const { BoxOptionDeleteBy1 } = getActionOptionsMenu();

    const validPagination = {
        pageIndex: pagination?.pageIndex ?? 0,
        pageSize: pagination?.pageSize > 0 ? pagination.pageSize : 10,
    };

    return (
        <MaterialReactTable
            columns={columns || []}
            data={data || []}
            state={{
                isLoading,
                showProgressBars: isRefetching,
                pagination: validPagination,
            }}
            {...TableOptions}
            selectAllMode="page"
            muiRowDragHandleProps={({ table }) => OnDrowRows({ table })}
            renderTopToolbarCustomActions={({ table }) => (
                <TableHead tableData={table} handleDelete={Handels.handleDelete} refetch={() => refetch()} />
            )}
            autoResetPageIndex={false}
            enableSorting={false}
            positionToolbarAlertBanner="bottom"
            columnFilterDisplayMode="popover"
            rowPinningDisplayMode="top-and-bottom"
            manualPagination
            rowCount={typeof total === "number" ? total : 0}
            onPaginationChange={setPagination}
            muiTablePaginationProps={{
                rowsPerPageOptions: [10, 20, 50],
                showFirstButton: true,
                showLastButton: true,
            }}
            localization={LanguageOption}
            renderRowActionMenuItems={({ row, table, closeMenu }) =>
                ActionOption(table, row.original, Handels, closeMenu, BoxOptionDeleteBy1)
            }
        />
    );
};