import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./Context/authCntextProvider";

import Login from "./Pages/Login";
import Home from "./Pages/Home";
import SignUp from "./Pages/Signup";
import Error from "./Pages/NotFound";
import WishList from "./Pages/WishList";
import Verify from "./Pages/VerificationPage";
import CheckEmail from "./Pages/CheckEmail";
import PersistLogin from "./utils/persistLogin";

const FullPrivateRoutes = () => {
  const { isAuthenticated } = useAuth();

  return <>{isAuthenticated ? <Outlet /> : <Navigate to='/login' />}</>;
};

const MidPrivateRoutes = () => {
  const { isAuthenticated } = useAuth();

  return <>{!isAuthenticated ? <Outlet /> : <Navigate to='/signUp' />}</>;
};

const RoutesFile = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/*' element={<Error />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />

        <Route element={<PersistLogin />}>
          <Route element={<FullPrivateRoutes />}>
            <Route path='/wishlist/:username' element={<WishList />} />
          </Route>
          <Route element={<MidPrivateRoutes />}>
            <Route path='/verify' element={<Verify />} />
            <Route path='/checkEmail' element={<CheckEmail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesFile;
