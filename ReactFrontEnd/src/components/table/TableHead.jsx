import { Fragment } from "react";
import { GetInfoTable } from "./options/TableOption";
import { Box, IconButton, Tooltip } from '@mui/material';
import { UseTableHead } from "./hooks/useTablehead";
import ActionMenu from "../Menu/ActionMenu";
import { getActionOptionsMenu } from "./options/TableActionMenuOption";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { getFromActionMenu } from "../form/options/FormActionMenuOption";
import FormWrapper from "../form/FormWrapper"; // Import FormWrapper (adjust path as needed)

const TableHead = ({ tableData, handleDelete, refetch }) => {
  const { AddOption, DeleteOption, RefreshOption, TableName } = GetInfoTable();
  const FromActionMenu = getFromActionMenu(AddOption).ADD; // ActionMenu config for adding
  const { DeleteSelected } = UseTableHead(tableData, handleDelete);
  const rows = tableData.getSelectedRowModel().rows;
  const { BoxOptionDeleteByN } = getActionOptionsMenu(rows, DeleteSelected, DeleteOption);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        padding: '8px',
        flexWrap: 'wrap',
      }}
    >
      <Tooltip arrow title={RefreshOption}>
        <IconButton onClick={() => refetch()} className='px-3 rounded-none'>
          <FontAwesomeIcon icon={faRotateLeft} className="h5 mt-2"/>
        </IconButton>
      </Tooltip>
      {["etudiants", "professeurs"].includes(TableName) && (
        <Fragment>
          <ActionMenu contentOptions={BoxOptionDeleteByN} />
          {/* Replace ActionMenu with FormWrapper */}
          <FormWrapper matricule={null} row={null} typeOpt="ADD" />
        </Fragment>
      )}
    </Box>
  );
};

export default TableHead;