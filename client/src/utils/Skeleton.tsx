import React, { useEffect } from "react";

import PublicHeader from "../Components/TheHeader/index";
import Footer from "../Components/Footer/index";
import CreatorHeader from "../Container/TheHeader/index";

import { iLocalUser } from "../Types/creatorStuffTypes";
import { useLocation } from "react-router-dom";
import { onRefreshToken } from "../API/authApi";
import Loader from "./Loader";

import { GlobalValuesContext } from "../Context/globalValuesContextProvider";
import { useContext } from "react";
import { iGlobalValues } from "../Types/globalVariablesTypes";

const Skeleton = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = React.useState(true); // This is for the loader
  const [user_info, setUser_info] = React.useState<iLocalUser | null>(null);

  let location = useLocation();
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { setRefetchCreatorData, setCreator_username } =
    contextValues as iGlobalValues;

  useEffect(() => {
    let username = window.location.pathname.split("/")[2];
    setCreator_username(() => username);

    (async () => {
      try {
        const response = await onRefreshToken();

        if (response.status === 200) {
          let user_info: iLocalUser = {
            username: response.data.user.username,
            creator_id: response.data.user.creator_id,
            role: response.data.role,
          };
          setUser_info(user_info);

          localStorage.setItem("user_info", JSON.stringify(user_info));
        }
        setIsLoading(false);
      } catch (error: any) {
        if (error.response.status !== 403) {
          console.error(error);
        }
        localStorage.removeItem("user_info");
        setUser_info(null);
        setIsLoading(false);
        setIsLoading(false);
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
          {user_info?.role === "creator" ? <CreatorHeader /> : <PublicHeader />}
          {children}
          <Footer />
        </>
      )}
    </>
  );
};

export default Skeleton;
