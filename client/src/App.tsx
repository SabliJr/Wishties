import React, { useEffect } from "react";
import "./App.css";

//RoutersFile
import LaRoutes from "./Routes";
import { GlobalValuesProvider } from "./Context/globalValuesContextProvider";
import { AuthProvider } from "./Context/authCntextProvider";

import ReactGA from "react-ga4";
ReactGA.initialize("G-BVRQT2SHLP");
ReactGA.send({
  hitType: "pageview",
  page: window.location.pathname,
});

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
