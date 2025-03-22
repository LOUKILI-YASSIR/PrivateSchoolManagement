import React from "react";
import {Routes, Route } from "react-router-dom";
import routes from "./config/routes"; // Assuming this file is saved in a "config" folder

const App = () => {
  return (
    <Routes>
      {routes.map(({ path, element, content }, index) => (
        <Route
          key={index}
          path={path}
          element={
            content ? (
              <>{React.cloneElement(element, { content })}</>
            ) : (
              element
            )
          }
        />
      ))}
    </Routes>
  );
};

export default App;
