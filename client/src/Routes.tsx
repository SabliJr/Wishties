import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Home from "./Pages/Home";
import SignUp from "./Pages/Signup";
import Error from "./Pages/NotFound";
import WishList from "./Pages/WishList";
import { UserProfileContextProvider } from "./Context/UserProfileContextProvider";

const RoutesFile = () => {
  return (
    <BrowserRouter>
      <UserProfileContextProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='*' element={<Error />} />
          <Route path='/wishlist' element={<WishList />} />
        </Routes>
      </UserProfileContextProvider>
    </BrowserRouter>
  );
};

export default RoutesFile;
