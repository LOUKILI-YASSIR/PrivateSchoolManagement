import React from "react";
import AppRoutes from "./config/AppRoutes";
import { UserProfileProvider } from './utils/contexts/UserProfileContext';
import { AuthProvider } from './utils/contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <AppRoutes />
      </UserProfileProvider>
    </AuthProvider>
  );
};

export default App;
