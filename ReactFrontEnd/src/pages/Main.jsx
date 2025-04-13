import { Card } from "react-bootstrap";
import "../components/dashboard/Dashboard.module.css";
import { TableTemplate } from "../components/table/Table.jsx";
import Head from "./MainHead.jsx";
import { MainProvider } from "../utils/contexts/MainContext.jsx";
import { useSelector } from "react-redux";

export default function Main ({ApiName}) {
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
  
  return (
    <MainProvider {...{ApiName}}> 
      <div id="info">
        <Card 
          className={`shadow-lg rounded-2xl p-6 ${isDarkMode ? 'bg-dark text-light' : 'bg-white text-dark'}`}
          style={{
            backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            color: isDarkMode ? '#e0e0e0' : 'inherit',
            transition: 'all 0.3s ease',
            borderRadius: '10px',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          <Head/>
          <div className="p-6 pb-0">
            <div className="overflow-x-auto" style={{height:"100%"}}>
              <TableTemplate/>
            </div>
          </div>
        </Card>
      </div>
    </MainProvider>
  );
};


