import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Pricing from "./Pages/Pricing";
import Home from "./Pages/Home";

const RoutesFile = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route />
        <Route path='/' element={<Home />} />
        <Route path='/pricing' element={<Pricing />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesFile;
