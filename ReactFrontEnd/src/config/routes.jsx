import Profile from "../components/profile/Profile";
import Menu from "../layouts/Menu";
import Main from "../pages/Main";
import DashBoard from "../pages/DashBoard";
import ErrorPage from "../components/errors/Errors";
import Login from "../components/Auth/Login";
import { Navigate } from "react-router-dom";
import ResetPasswordRequest from "../components/Auth/ResetPasswordRequest";
import ResetPassword from "../components/Auth/ResetPassword";
import SelectResetPasswordType from "../components/Auth/SelectResetPasswordType";
import EmailSmsResetPassword from "../components/Auth/EmailSmsResetPassword";
import CheckUserResetPassword from "../components/Auth/CheckUserResetPassword";

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
        element: <Main ApiName="evaluations" />
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
    element: <ResetPasswordRequest />
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
    element: <EmailSmsResetPassword type="sms" />
  },
  {
    path: "/YLSchool/reset-password-request-email",
    element: <EmailSmsResetPassword type="email" />
  },
  {
    path: "/YLSchool/check-user-reset-password",
    element: <CheckUserResetPassword />
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