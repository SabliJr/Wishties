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
import NotFound from "./Pages/NotFound";
import WishList from "./Pages/WishList";
import Verify from "./Pages/VerificationPage";
import CheckEmail from "./Pages/CheckEmail";
import PersistLogin from "./utils/persistLogin";
import VerifyEmail from "./Components/Verification/verifyEmail";
import Contact from "./Pages/Contact";
import Help from "./Pages/Help";
import About from "./Pages/About";
import HowItWorks from "./Pages/HowItWorks";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";

import { iAuth } from "./Types/creatorSocialLinksTypes";
import CreatorPage from "./Pages/CreatorPublicPage";
import Cart from "./Pages/Cart";

const FullPrivateRoutes = () => {
  const { auth, setAuth } = useAuth();

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
        <Route path='/login' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/verify-email/:token' element={<VerifyEmail />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/terms-of-service' element={<TermsOfService />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/how-it-works' element={<HowItWorks />} />
        <Route path='/help' element={<Help />} />
        <Route path='/about' element={<About />} />

        <Route element={<PersistLogin />}>
          <Route element={<FullPrivateRoutes />}>
            <Route path='/edit-profile/:username' element={<WishList />} />
          </Route>

          <Route path='/verify' element={<Verify />} />
          <Route path='/check-email' element={<CheckEmail />} />
        </Route>
        <Route path='/wishlist/:username' element={<CreatorPage />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesFile;
