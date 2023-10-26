import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Home from "./Pages/Home";
import SignUp from "./Pages/Signup";

const RoutesFile = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route />
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesFile;
