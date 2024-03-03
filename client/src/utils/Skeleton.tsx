import React, { useEffect } from "react";

import PublicHeader from "../Components/TheHeader/index";
import Footer from "../Components/Footer/index";
import CreatorHeader from "../Container/TheHeader/index";

import { useLocation } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "../Context/AuthProvider";

import useRefreshToken from "../Hooks/useRefreshToken";

const Skeleton = ({ children }: { children: React.ReactNode }) => {
  const { refresh, isLoading } = useRefreshToken();
  let location = useLocation();
  let { state } = useAuth();

  useEffect(() => {
    refresh();
  }, [location]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {state.isAuthenticated ? <CreatorHeader /> : <PublicHeader />}
      {children}
      <Footer />
    </>
  );
};

export default Skeleton;