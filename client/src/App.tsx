import React from "react";
import "./App.css";

//RoutersFile
import LaRoutes from "./Routes";
import { GlobalValuesProvider } from "./Context/globalValuesContextProvider";
import { AuthProvider } from "./Context/AuthProvider";
import CreatorDataProvider from "./Context/CreatorDataProvider";

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
        <CreatorDataProvider>
          <GlobalValuesProvider>
            <LaRoutes />
          </GlobalValuesProvider>
        </CreatorDataProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
