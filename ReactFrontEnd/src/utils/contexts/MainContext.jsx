import React, { createContext, useEffect, useState, useMemo, useCallback, useContext } from "react";
import { useFetchData } from "../../api/queryHooks.jsx";
import { useAuth } from "./AuthContext.jsx";

export const MainContext = createContext();

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error('useMainContext must be used within a MainProvider');
  }
  return context;
};

export const MainProvider = ({ ApiName, children, columns: propColumns }) => {
  const { userRole } = useAuth();
  const MatriculeUT = sessionStorage.getItem("userID");
  const { 
    data: fetchResponse, 
    isLoading: isFetching, 
    isRefetching,
    isError,
    error, 
    refetch
  } = userRole === "admin" ? useFetchData(ApiName) : useFetchData(ApiName+"/"+MatriculeUT);

  const [tableData, setTableData] = useState([]);
  const [Data,setData] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (isError || fetchResponse?.error) {
      console.error('Error fetching data:', error?.message || fetchResponse?.message);
      setData([])
    }
    setIsLoading(isFetching || isRefetching);
  }, [fetchResponse, isError, error, isFetching, isRefetching]);

  const actualData = useMemo(() => {
    if (!fetchResponse) return [];
    if (Array.isArray(fetchResponse)) return fetchResponse;
    if (fetchResponse?.data) {
      if (Array.isArray(fetchResponse.data)) return fetchResponse.data;
      if (Array.isArray(fetchResponse.data.data)) return fetchResponse.data.data;
    }
    return [];
  }, [fetchResponse]);
  
  const columns = useMemo(() => propColumns || [], [propColumns]);
  useEffect(()=>setData(actualData),[actualData])
  return (
    <MainContext.Provider
      value={{
        data: Data,
        columns,
        isLoading,
        isRefetching,
        error: error || fetchResponse?.error,
        refetch: useCallback(() => {
          setIsLoading(true);
          return refetch();
        }, [refetch]),
        TableName: ApiName,
        tableData,
        setTableData,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};