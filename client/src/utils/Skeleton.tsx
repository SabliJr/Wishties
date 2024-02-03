import React, { useEffect, useContext } from "react";

import PublicHeader from "../Components/TheHeader/index";
import Footer from "../Components/Footer/index";
import CreatorHeader from "../Container/TheHeader/index";

import { useLocation } from "react-router-dom";
import { onRefreshToken } from "../API/authApi";
import Loader from "./Loader";

import { GlobalValuesContext } from "../Context/globalValuesContextProvider";
import { iGlobalValues } from "../Types/globalVariablesTypes";
import { useAuth } from "../Context/AuthProvider";

const Skeleton = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = React.useState(true); // This is for the loader

  let location = useLocation();
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { setRefetchCreatorData } = contextValues as iGlobalValues;
  const { dispatch, state } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const response = await onRefreshToken();

        if (response.status === 200) {
          dispatch({
            type: "LOGIN",
            payload: {
              accessToken: response.data.accessToken,
              user_id: response.data.user.creator_id,
              creator_username: response.data.user.username,
            },
          });
        }
        setIsLoading(false);
      } catch (error: any) {
        if (error.response?.status !== 403) {
          setIsLoading(false);
        } else {
          dispatch({ type: "LOGOUT" });
          setIsLoading(false);
        }
      }
    })();

    setRefetchCreatorData(true);
  }, [location]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {state.isAuthenticated ? <CreatorHeader /> : <PublicHeader />}
          {children}
          <Footer />
        </>
      )}
    </>
  );
};

export default Skeleton;
