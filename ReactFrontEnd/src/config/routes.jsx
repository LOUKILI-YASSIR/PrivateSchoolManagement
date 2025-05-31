import Profile from "../components/profile/Profile";
import Menu from "../layouts/Menu";
import Main from "../pages/Main";
import DashBoard from "../pages/DashBoard";
import ErrorPage from "../components/errors/Errors";
import Login from "../components/Auth/Login";
import { Navigate, useLocation } from "react-router-dom";
import ResetPasswordRequest from "../components/Auth/ResetPasswordRequest";
import ResetPassword from "../components/Auth/ResetPassword";
import SelectResetPasswordType from "../components/Auth/SelectResetPasswordType";
import EmailSmsResetPassword from "../components/Auth/EmailSmsResetPassword";
import CheckUserResetPassword from "../components/Auth/CheckUserResetPassword";
import GoogleAuthResetPassword from "../components/Auth/GoogleAuthResetPassword";

// Custom wrapper components to handle route context
const GoogleAuthWrapper = () => {
  const location = useLocation();
  const isFromLogin = location.state?.verificationFlow !== undefined;
  
  return <GoogleAuthResetPassword isFromLogin={isFromLogin} />;
};

const EmailSmsWrapper = ({ type }) => {
  const location = useLocation();
  const isFromLogin = location.state?.verificationFlow !== undefined;
  
  return <EmailSmsResetPassword type={type} isFromLogin={isFromLogin} />;
};

const ResetPasswordRequestWrapper = () => {
  const location = useLocation();
  const isFromLogin = location.state?.verificationFlow !== undefined;
  
  return <ResetPasswordRequest isFromLogin={isFromLogin} />;
};

const routes = [
  {
    path: "/YLSchool",
    element: <Menu />,
    children: [
      {
        path: "DashBoard",
        element: <DashBoard />
      },
      {
        path: "Profile",
        element: <Profile />
      },
      {
        path: "Etudiants",
        element: <Main ApiName="etudiants" />
      },
      {
        path: "AnneeScolaire",
        element: <Main ApiName="academic-years" />
      },
      {
        path: "Professeurs",
        element: <Main ApiName="professeurs" />
      },
      {
        path: "Matiere",
        element: <Main ApiName="matieres" />
      },
      {
        path: "Niveaux",
        element: <Main ApiName="niveaux" />
      },
      {
        path: "Salles",
        element: <Main ApiName="salles" />
      },
      {
        path: "Groupes",
        element: <Main ApiName="groups" />
      },
      {
        path: "Evaluations",
        element: <Main ApiName="evaluation-types" />
      },
      {
        path: "TimeTables",
        element: <Main ApiName="regular-timetables" />
      }
    ]
  },
  {
    path: "/YLSchool/Login",
    element: <Login />
  },
  {
    path: "/YLSchool/error",
    element: <ErrorPage />
  },
  {
    path: "/YLSchool/reset-password-request",
    element: <ResetPasswordRequestWrapper />
  },
  {
    path: "/YLSchool/reset-password",
    element: <ResetPassword />
  },
  {
    path: "/YLSchool/select-reset-password",
    element: <SelectResetPasswordType />
  },
  {
    path: "/YLSchool/reset-password-request-sms",
    element: <EmailSmsWrapper type="sms" />
  },
  {
    path: "/YLSchool/reset-password-request-email",
    element: <EmailSmsWrapper type="email" />
  },
  {
    path: "/YLSchool/check-user-reset-password",
    element: <CheckUserResetPassword />
  },
  {
    path: "/YLSchool/reset-password-request-totp",
    element: <GoogleAuthWrapper />
  },
  {
    path: "/",
    element: <Navigate to="/YLSchool/Login" replace />
  },
  {
    path: "*",
    element: <Navigate to="/YLSchool/error" state={{ errorType: '404' }} replace />
  },
];

export default routes;