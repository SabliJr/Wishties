import React from "react";
import "./App.css";

//RoutersFile
import LaRoutes from "./Routes";
import { GlobalValuesProvider } from "./Context/globalValuesContextProvider";
import { AuthProvider } from "./Context/authCntextProvider";

const App = () => {
  return (
    <div className='App'>
      <AuthProvider>
        <GlobalValuesProvider>
          <LaRoutes />
        </GlobalValuesProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
