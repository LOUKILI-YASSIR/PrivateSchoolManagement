import React, { createContext, useContext, useState } from 'react';

const TableContext = createContext();

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};

export const TableProvider = ({ children }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    tableData,
    setTableData,
    loading,
    setLoading,
    error,
    setError,
  };

  return (
    <TableContext.Provider value={value}>
      {children}
    </TableContext.Provider>
  );
}; 