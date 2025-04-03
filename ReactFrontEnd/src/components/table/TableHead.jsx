import { Fragment } from "react";
import { GetInfoTable } from "./options/TableOption";
import { Box, IconButton, Tooltip } from '@mui/material';
import { UseTableHead } from "./hooks/useTablehead";
import ActionMenu from "../Menu/ActionMenu";
import { getActionOptionsMenu } from "./options/TableActionMenuOption";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { getFromActionMenu } from "../form/options/FormActionMenuOption";
import FormWrapper from "../form/FormWrapper";
import { useSelector } from "react-redux";

const TableHead = ({ tableData, handleDelete, refetch }) => {
  const { AddOption, DeleteOption, RefreshOption, TableName } = GetInfoTable();
  const FromActionMenu = getFromActionMenu(AddOption).ADD; // ActionMenu config for adding
  const { DeleteSelected } = UseTableHead(tableData, handleDelete);
  const rows = tableData.getSelectedRowModel().rows;
  const { BoxOptionDeleteByN } = getActionOptionsMenu(rows, DeleteSelected, DeleteOption);
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        padding: '8px',
        flexWrap: 'wrap',
        color: isDarkMode ? '#e0e0e0' : 'inherit',
        transition: 'all 0.3s ease',
      }}
    >
      <Tooltip arrow title={RefreshOption}>
        <IconButton 
          onClick={() => refetch()} 
          className='px-3 rounded-none'
          sx={{ 
            color: isDarkMode ? 'rgba(224, 224, 224, 0.8)' : 'rgba(0, 0, 0, 0.6)',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          <FontAwesomeIcon icon={faRotateLeft} className="h5 mt-2"/>
        </IconButton>
      </Tooltip>
      {["etudiants", "professeurs"].includes(TableName) && (
        <Fragment>
          <ActionMenu 
            contentOptions={BoxOptionDeleteByN} 
            maxWidth="xs"
            disableBackdropClick={false}
            style={{ 
              borderLeft: isDarkMode ? '3px solid rgba(220, 38, 38, 0.8)' : '3px solid rgba(220, 38, 38, 0.7)' 
            }}
          />
          {/* Replace ActionMenu with FormWrapper */}
          <FormWrapper matricule={null} row={null} typeOpt="ADD" />
        </Fragment>
      )}
    </Box>
  );
};

export default TableHead;