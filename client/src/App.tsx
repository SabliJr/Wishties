import React from "react";
import "./App.css";

//RoutersFile
import LaRoutes from "./Routes";
import { GlobalValuesProvider } from "./Context/globalValuesContextProvider";
import { ToastContainer } from "react-toastify";

import ReactGA from "react-ga4";
ReactGA.initialize("G-BVRQT2SHLP");
ReactGA.send({
  hitType: "pageview",
  page: window.location.pathname,
});

const App = () => {
  return (
    <div className='App'>
      <ToastContainer />
      <GlobalValuesProvider>
        <LaRoutes />
      </GlobalValuesProvider>
    </div>
  );
};

export default App;
