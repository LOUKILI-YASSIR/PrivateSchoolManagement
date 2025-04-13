
/**
 * Generates optimal page size options based on total count
 * @param {number} totalCount - Total number of records
 * @returns {Array<number>} Array of page size options
 */
const generatePageSizeOptions = (totalCount) => {
    if (!totalCount || totalCount <= 0) return [10, 25, 50];

    const options = [10]; // Always start with 10
    let current = 10;

    // Add intermediate options
    while (current < totalCount) {
        // Double the size for next option
        current *= 2;
        
        // Round to nearest nice number
        if (current <= 100) {
            current = Math.ceil(current / 25) * 25;
        } else {
            current = Math.ceil(current / 100) * 100;
        }

        // Add option if it's less than total count
        if (current < totalCount) {
            options.push(current);
        }
    }

    // Add total count as last option if it's reasonable
    if (totalCount <= 10000) {
        options.push(totalCount);
    }

    // Ensure we don't have too many options
    if (options.length > 6) {
        const step = Math.floor(options.length / 5);
        return options.filter((_, index) => index % step === 0 || index === options.length - 1);
    }

    return options;
};

export const createTableConfig = (totalCount = 0) => ({
    pagination: {
        rowsPerPageOptions: generatePageSizeOptions(totalCount),
        showFirstButton: true,
        showLastButton: true,
        color: 'primary',
        shape: 'rounded',
        showRowsPerPage: true,
        variant: 'outlined'
    },

    style: {
        paper: {
            elevation: 0,
            sx: {
                borderRadius: '16px',
                padding: '18px 24px',
                transition: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            },
        },
        container: {
            sx: {
                flex: 1,
                maxHeight: '600px',
            },
        },
        bodyRow: {
            hover: true,
            sx: {
                cursor: 'pointer',
            }
        }
    },

    features: {
        enableSorting: true,
        positionToolbarAlertBanner: "bottom",
        columnFilterDisplayMode: "popover",
        rowPinningDisplayMode: "top-and-bottom",
        paginationDisplayMode: "pages",
    enableRowVirtualization: false,
    enableColumnVirtualization: false,
        enablePagination: true,
    enableColumnResizing: true,
    enableDensityToggle: true,
    enableHiding: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableFullScreenToggle: true,
    enableTopToolbar: true,
        enableBottomToolbar: true,
        selectAllMode: "page",
        muiTableBodyProps: {
            sx: {
                virtualizer: {
                    overscan: 10,
                    estimateSize: () => 52,
                }
            }
        },
        muiTablePaperProps: {
            sx: {
                height: '100%'
            }
        },
        paginateExpandedRows: false,
        enableRowNumbers: false,
        manualPagination: false,
        defaultDisplayColumn: { enableResizing: false }
    }
});

export const createTableTheme = (isDarkMode) => ({
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
