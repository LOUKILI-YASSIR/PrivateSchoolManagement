import Profile from "../components/profile/Profile";
import Menu from "../layouts/Menu";
import Main from "../pages/Main";
import DashBoard from "../pages/DashBoard";
import ErrorPage from "../components/errors/Errors";
import Login from "../components/Auth/Login";
import { Navigate } from "react-router-dom";

const routes = [
  {
    path: "/YLSchool",
    element: <Menu />,
    children: [
      {
        path: "Login",
        element: <Login />
      },
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
        path: "Professeurs",
        element: <Main ApiName="professeurs" />
      }
    ]
  },
  {
    path: "/YLSchool/error",
    element: <ErrorPage />
  },
  {
    path: "*",
    element: <Navigate to="/YLSchool/error" state={{ errorType: '404' }} replace />
  },
];

export default routes;