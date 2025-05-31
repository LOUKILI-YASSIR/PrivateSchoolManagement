import { MaterialReactTable } from "material-react-table";
import TableHead from "./TableHead.jsx";
import { GetInfoTable } from "./options/TableOption.jsx";
import { useTable } from "./hooks/useTable.jsx";
import { useColumns } from "./hooks/useColumn.jsx";
import { useHandlesData } from "./hooks/useData.jsx";
import { getActionOptionsMenu } from "./options/TableActionMenuOption.jsx";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme } from '@mui/material';
import { createTableConfig, createTableTheme } from './config/tableConfig.jsx';

export const TableTemplate = () => {
    const {
        data,
        columns: contextColumns,
        isLoading,
        isRefetching,
        refetch,
        TableName,
        extraData,
        isLoadingExtra = {},  
        extraErrors = {},     
        OnDrowRows
    } = useTable();
    
    const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
    const { ActionOption, LanguageOption, TableOptions } = GetInfoTable(TableName);
    const customColumns  = useColumns(data, TableName, extraData);
    const Handels = useHandlesData(TableName);
    const { BoxOptionDeleteBy1, BoxOptionGrade } = getActionOptionsMenu();

    const finalColumns = contextColumns?.length > 0 ? contextColumns : customColumns;
    const tableTheme = createTheme(createTableTheme(isDarkMode));
    const isTableLoading = isLoading || isRefetching || Object.values(isLoadingExtra).some(loading => loading);
    const hasErrors = extraErrors && Object.values(extraErrors).some(error => error !== null);

    // Get table configuration based on data length
    const { pagination, style, features } = createTableConfig(data?.length || 0);

    return (
        <ThemeProvider theme={tableTheme}>
            <MaterialReactTable
                columns={finalColumns || []}
                data={data || []}
                {...TableOptions}
                {...features}
                muiRowDragHandleProps={({ table }) => OnDrowRows?.({ table })}
                renderTopToolbarCustomActions={({ table }) => (
                    <TableHead 
                        tableData={table} 
                        handleDelete={Handels.handleDelete} 
                        refetch={refetch}
                        hasErrors={hasErrors}
                        isLoading={isTableLoading}
                    />
                )}
                muiPaginationProps={pagination}
                localization={LanguageOption}
                renderRowActionMenuItems={({ row, table, closeMenu }) =>
                    ActionOption?.(table, row.original, Handels, closeMenu, BoxOptionDeleteBy1, BoxOptionGrade)
                }
                muiTablePaperProps={style.paper}
                muiTableContainerProps={{
                    ...style.container,
                    style: {
                        ...style.container?.style,
                        maxWidth: '100%', // Ensure table takes full width of container
                    }
                }}
                muiTableBodyRowProps={style.bodyRow}
                initialState={{
                    density: 'compact',
                }}
                enableColumnResizing={true}
                columnResizeMode="onChange"
                defaultColumn={{
                    enableResizing: true,
                    minSize: 40, // Minimum column width
                    maxSize: 500, // Maximum column width
                }}
                state={{
                    isLoading: isTableLoading,
                    showProgressBars: isRefetching,
                }}
            />
        </ThemeProvider>
    );
};