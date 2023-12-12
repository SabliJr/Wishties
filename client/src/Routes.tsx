import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";

import Login from "./Pages/Login";
import Home from "./Pages/Home";
import SignUp from "./Pages/Signup";
import Error from "./Pages/NotFound";
import WishList from "./Pages/WishList";
import Verify from "./Pages/VerificationPage";
import Loader from "./Loader";
import CheckEmail from "./Pages/CheckEmail";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  const isAuth = token ? true : false;
  const isCreator = localStorage.getItem("isCreator") === "true" ? true : false;
  const isUser = localStorage.getItem("isUser") === "true" ? true : false;
  const isCreatorOrUser = isCreator || isUser;
  const isCreatorAndUser = isCreator && isUser;
  const isCreatorOrUserAndAuth = isCreatorOrUser && isAuth;

  return <>{isAuth ? <Outlet /> : <Navigate to='/signUp' />}</>;
};

const CreatorRoutes = () => {
  const token = localStorage.getItem("token");
  const isAuth = token ? true : false;
  const isCreator = localStorage.getItem("isCreator") === "true" ? true : false;
  const isUser = localStorage.getItem("isUser") === "true" ? true : false;
  const isCreatorOrUser = isCreator || isUser;
  const isCreatorAndUser = isCreator && isUser;
  const isCreatorOrUserAndAuth = isCreatorOrUser && isAuth;

  return <>{!isCreatorOrUserAndAuth ? <Outlet /> : <Navigate to='/login' />}</>;
};

const RoutesFile = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/*' element={<Error />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/loader' element={<Loader />} />
        <Route path='/check-email' element={<CheckEmail />} />
        {/* <Route path='/wishlist' element={<WishList />} /> */}

        <Route element={<PrivateRoutes />}>
          <Route path='/wishlist' element={<WishList />} />
        </Route>
        <Route element={<CreatorRoutes />}>
          <Route path='/login' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesFile;
