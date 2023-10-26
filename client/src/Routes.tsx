import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Home from "./Pages/Home";

const RoutesFile = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route />
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesFile;
