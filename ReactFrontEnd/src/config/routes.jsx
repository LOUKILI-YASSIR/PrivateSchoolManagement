import Login from "../components/login/Login";
import Menu from "../layouts/Menu";
import Main from "../pages/Main";
import DashBoard from "../pages/DashBoard";
import ErrorPage from "../components/errors/Errors";

const routes = [
  {
    path: "/YLSchool/Login",
    element: <Login />,
  },
  {
    path: "/YLSchool/DashBoard",
    element: <Menu />,
    content: <DashBoard />,
  },
  {
    path: "/YLSchool/Etudiants",
    element: <Menu />,
    content: <Main ApiName="etudiants" />,
  },
  {
    path: "/YLSchool/Professeurs",
    element: <Menu />,
    content: <Main ApiName="professeurs" />, //props of element <element content={content}/>
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];
export default routes