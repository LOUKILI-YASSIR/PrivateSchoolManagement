import { useContext } from 'react';
import { TableHead as MuiTableHead, TableRow, TableCell, TableSortLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { MainContext } from '../../../utils/contexts/MainContext';

export const getTableHead = (columns, onSort) => {
  const { t } = useTranslation();
  const { theme } = useContext(MainContext);

  return (
    <MuiTableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.align}
            style={{ 
              minWidth: column.minWidth,
              backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
              color: theme === 'dark' ? '#fff' : '#000'
            }}
          >
            <TableSortLabel
              active={column.sortable}
              direction={column.sortDirection || 'asc'}
              onClick={() => column.sortable && onSort(column.id)}
              sx={{
                color: theme === 'dark' ? '#fff' : '#000',
                '&.MuiTableSortLabel-active': {
                  color: theme === 'dark' ? '#fff' : '#000',
                },
                '&:hover': {
                  color: theme === 'dark' ? '#fff' : '#000',
                }
              }}
            >
              {t(column.label)}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </MuiTableHead>
  );
}; 