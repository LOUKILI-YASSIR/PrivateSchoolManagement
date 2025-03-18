import { Card } from "react-bootstrap";
import "../components/dashboard/Dashboard.module.css";
import { TableTemplate } from "../modules/main_content/table/Table.jsx";
import Head from "../modules/main_content/MainHead.jsx";
import { MainProvider } from "../modules/main_content/contexts/MainContext.jsx";

export default function Main ({ApiName}) {
  return (
    <MainProvider {...{ApiName}}> 
      <div id="info" className="m-3">
        <Card className="bg-white shadow-lg rounded-2xl p-6">
          <Head/>
          <div className="p-6 pb-0">
            <div className="overflow-x-auto">
              <TableTemplate/>
            </div>
          </div>
        </Card>
      </div>
    </MainProvider>
  );
};


