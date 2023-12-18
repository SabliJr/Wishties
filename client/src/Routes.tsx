import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./Context/authCntextProvider";

import Login from "./Pages/Login";
import Home from "./Pages/Home";
import SignUp from "./Pages/Signup";
import Error from "./Pages/NotFound";
import WishList from "./Pages/WishList";
import Verify from "./Pages/VerificationPage";
import CheckEmail from "./Pages/CheckEmail";
import PersistLogin from "./utils/persistLogin";
import VerifyEmail from "./Components/Verification/verifyEmail";

import { iAuth } from "./Types/creatorSocialLinksTypes";

const FullPrivateRoutes = () => {
  const { auth, setAuth } = useAuth();
  console.log("auth", auth);

  useEffect(() => {
    setAuth(auth as iAuth);
  }, [auth, setAuth]);

  return (
    <>{(auth as iAuth)?.accessToken ? <Outlet /> : <Navigate to='/login' />}</>
  );
};

const RoutesFile = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/*' element={<Error />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/verify-email/:token' element={<VerifyEmail />} />

        <Route element={<PersistLogin />}>
          <Route element={<FullPrivateRoutes />}>
            <Route path='/wishlist/:username' element={<WishList />} />
          </Route>

          <Route path='/verify' element={<Verify />} />
          <Route path='/check-email' element={<CheckEmail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesFile;
