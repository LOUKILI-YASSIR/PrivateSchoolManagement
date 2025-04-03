import { MaterialReactTable } from "material-react-table";
import TableHead from "./TableHead.jsx";
import { GetInfoTable } from "./options/TableOption.jsx";
import { useTable } from "./hooks/useTable.jsx";
import { useColumns } from "./hooks/useColumn.jsx";
import { useHandlesData } from "./hooks/useData.jsx";
import { getActionOptionsMenu } from "./options/TableActionMenuOption.jsx";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme } from '@mui/material';

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
    
    const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
    const { ActionOption, LanguageOption, TableOptions } = GetInfoTable(TableName);
    const columns = useColumns(data, TableName);
    const Handels = useHandlesData(TableName);
    const { BoxOptionDeleteBy1 } = getActionOptionsMenu();

    const validPagination = {
        pageIndex: pagination?.pageIndex ?? 0,
        pageSize: pagination?.pageSize > 0 ? pagination.pageSize : 10,
    };

    // Create theme based on dark/light mode
    const tableTheme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
            background: {
                default: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : '#ffffff',
                paper: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : '#ffffff',
            },
            text: {
                primary: isDarkMode ? '#e0e0e0' : 'rgba(0, 0, 0, 0.87)',
                secondary: isDarkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            },
            divider: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        },
    });

    return (
        <ThemeProvider theme={tableTheme}>
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
                muiTablePaperProps={{
                    elevation: 0,
                    sx: {
                        borderRadius: '16px',
                        padding: '18px 24px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    },
                }}
                localization={LanguageOption}
                renderRowActionMenuItems={({ row, table, closeMenu }) =>
                    ActionOption(table, row.original, Handels, closeMenu, BoxOptionDeleteBy1)
                }
            />
        </ThemeProvider>
    );
};