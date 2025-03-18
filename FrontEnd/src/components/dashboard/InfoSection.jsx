import { Button, Card } from "react-bootstrap";
import "./DashBoard.module.css";
import { TableTemplate } from "../../modules/main_content/table/Table.jsx";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBorderNone, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { faCreditCard } from "@fortawesome/free-regular-svg-icons";
export default function InfoSection () {
    const {t:Traduction} = useTranslation()
    return (
      <div id="info" className="m-3">
        <Card className="bg-white shadow-lg rounded-2xl p-6">
          <div className="cardHeader  bg-[#2a2185] text-white h-20 flex items-center p-6 rounded-xl justify-between">
            <span className="h2">{Traduction("info.info")}</span>
            <Button className="bg-white text-blue-900 fw-bold Btn text-xl flex items-center">
              <FontAwesomeIcon icon={faGraduationCap} className="mr-2"/> {Traduction("info.lastRegistered")}
            </Button>
            <Button className="bg-white text-blue-900 fw-bold Btn text-xl flex items-center">
              <FontAwesomeIcon icon={faCreditCard} className="mr-2"/> {Traduction("info.schoolStats")}
            </Button>
            <Button className="bg-white text-blue-900 fw-bold Btn text-xl flex items-center">
              <FontAwesomeIcon icon={faBorderNone} className="mr-2"/> {Traduction("info.availableRooms")}
            </Button>
          </div>
          <div className="p-6 pb-0">
            <div className="overflow-x-auto">
              <TableTemplate/>
            </div>
          </div>
        </Card>
      </div>
    );
  };
