import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./components/Auth/Login";
import AppMenu from "./layouts/Menu";
import DashBoard from "./pages/DashBoard";
import Profile from "./components/profile/Profile";
import Main from "./pages/Main";
import ErrorPage from "./components/errors/Errors";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/YLSchool/Login" replace />} />
      <Route path="/YLSchool/Login" element={<Login />} />
      
      <Route path="/YLSchool" element={
        <AppMenu content={<Outlet />} />
      }>
        <Route index element={<Navigate to="DashBoard" replace />} />
        <Route path="DashBoard" element={<DashBoard />} />
        <Route path="Profile" element={<Profile />} />
        <Route path="Etudiants" element={<Main ApiName="etudiants" />} />
        <Route path="Professeurs" element={<Main ApiName="professeurs" />} />
      </Route>
      
      <Route path="/YLSchool/error" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/YLSchool/error" state={{ errorType: '404' }} replace />} />
    </Routes>
  );
};

export default App;
