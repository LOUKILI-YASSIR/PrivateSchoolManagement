import { Card as BootstrapCard } from "react-bootstrap";
import "./DashBoard.module.css";
import { getCards } from "./options/DashBoardOption.jsx";
import { useDashboard } from "./hooks/useDashboard.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePollVertical } from "@fortawesome/free-solid-svg-icons";
const Dashboard = () => {
    const {Language,isToggleActive} = useDashboard()
    return (
        <div className={`grid grid-cols-4 ${isToggleActive ? "active" : ""} p-4`} id="cardContainer">
            {getCards().map(({ name, description, color, icon, ClassIcon, count },index) => (
                <BootstrapCard
                    key={name}
                    className={`bg-white p-6 px-3 rounded-lg shadow-md cursor-pointer cartDashBoard ${isToggleActive ? "active" : ""} cartDashBoard-${color} hover:text-white`}
                >
                    <div
                        className={`flex flex-col justify-between mb-4 w-full px-2 ${
                            isToggleActive ? "cartDashBoard-Active" : ""
                        }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <FontAwesomeIcon 
                                icon={icon}
                                className={`text-3xl cartDashBoard-Icon 
                                    ${ isToggleActive ? `cartDashBoard-${ClassIcon}-Active` : "" }
                                    ${ [1,2].includes(index) ? "xl4" : ""}
                                `}
                            />
                            <div
                                className={`text-2xl tracking-tight mt-1 cartDashBoard-Icon ${
                                    isToggleActive ? "cartDashBoard-text-Active" : ""
                                }`}
                            >
                                {name}
                            </div>
                        </div>
                        <div className="flex items-center justify-end w-full px-2">
                            <div
                                className={`font-semibold text-4xl cartDashBoard-Count ${
                                    isToggleActive ? "cartDashBoard-Count-Active" : ""
                                }`}
                            >
                                {count}
                            </div>
                        </div>
                    </div>
                    <hr className="w-full mb-4" />
                    <div className={`text-${color}-500 px-2 w-full flex items-center cartDashBoard-Description`}>
                        <FontAwesomeIcon
                            icon={faSquarePollVertical}
                            className={`mr-2 ${
                                isToggleActive ? "cartDashBoard-DescriptionIcon-Active" : ""
                            } text-2xl`}
                        />
                        <div
                            className={`inline description ${
                                isToggleActive ? "cartDashBoard-Descripion-Active" : ""
                            }`}
                            style={{ fontSize: Language==="es" ? "12.5px" : "15px" }}
                        >
                            {description}
                        </div>
                    </div>
                </BootstrapCard>
            ))}
        </div>
    );
};

export default Dashboard;
