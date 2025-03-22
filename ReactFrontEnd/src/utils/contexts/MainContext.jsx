import { createContext, useEffect, useState, useCallback } from "react";
import { useFetchData } from "../../api/queryHooks.jsx";

export const MainContext = createContext();

export const MainProvider = ({ ApiName, children }) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleSetPagination = useCallback((updater) => {
    setPagination(prev => {
      const newValue = typeof updater === "function" 
        ? updater(prev) 
        : updater;
      
      // Validate and normalize values
      const pageIndex = Math.max(0, Number(newValue.pageIndex ?? prev.pageIndex));
      const pageSize = Math.max(1, Number(newValue.pageSize ?? prev.pageSize));
      
      return { pageIndex, pageSize };
    });
  }, []);

  const { data: { data = [], total = 0 } = {}, isLoading, error, isRefetching, refetch } = useFetchData(
    ApiName,
    pagination.pageIndex * pagination.pageSize,
    pagination.pageSize
  );

  const [tableData, setTableData] = useState([]);

  return (
    <MainContext.Provider
      value={{
        data,
        total,
        setPagination: handleSetPagination,
        pagination,
        isLoading,
        error,
        isRefetching,
        refetch,
        TableName: ApiName,
        tableData,
        setTableData,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};