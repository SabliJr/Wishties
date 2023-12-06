import React from "react";
import "./App.css";

//RoutersFile
import LaRoutes from "./Routes";
import { GlobalValuesProvider } from "./Context/globalValuesContextProvider";

const App = () => {
  return (
    <div className='App'>
      <GlobalValuesProvider>
        <LaRoutes />
      </GlobalValuesProvider>
    </div>
  );
};

export default App;
