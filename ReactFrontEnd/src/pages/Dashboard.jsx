import { Fragment, useEffect } from "react";
import Dashboard from "../components/dashboard/Dashboard.jsx";
import { useAuth } from "../utils/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AppDashBoard = () => {
  const { userRole } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!userRole || !["admin", "etudiant", "professeur"].includes(userRole)) {
      nav("/YLSchool/Login");
    }
  }, [userRole, nav]);

  // Render different dashboard content based on user role
  const renderDashboardContent = () => {
    switch (userRole) {
      case 'admin':
        return (
          <Fragment>
            <Dashboard type="admin" />
          </Fragment>
        );
      case 'professeur':
        return (
          <Fragment>
            <Dashboard type="professeur" />
          </Fragment>
        );
      case 'etudiant':
        return (
          <Fragment>
            <Dashboard type="etudiant" />
          </Fragment>
        );
      default:
        // Default dashboard if role isn't recognized
        return (
          <Fragment>
            <Dashboard />
          </Fragment>
        );
    }
  };
  
  return renderDashboardContent();
};

export default AppDashBoard;
