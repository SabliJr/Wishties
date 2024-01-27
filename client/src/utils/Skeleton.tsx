import React, { useEffect } from "react";

import PublicHeader from "../Components/TheHeader/index";
import Footer from "../Components/Footer/index";
import CreatorHeader from "../Container/TheHeader/index";

import { iLocalUser } from "../Types/creatorStuffTypes";
import { useLocation } from "react-router-dom";
import { onRefreshToken } from "../API/authApi";
import Loader from "./Loader";

const Skeleton = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = React.useState(true); // This is for the loader
  const [user_info, setUser_info] = React.useState<iLocalUser | null>(null);

  let { pathname } = useLocation();

  useEffect(() => {
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
      } catch (error) {
        if (error) {
          localStorage.removeItem("user_info");
          setUser_info(null);
        }
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [pathname]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          (
          {user_info?.role === "creator" ? <CreatorHeader /> : <PublicHeader />}
          {children}
          <Footer />)
        </>
      )}
    </>
  );
};

export default Skeleton;
