import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../Hooks/useRefreshToken";
import { useAuth } from "../Context/authCntextProvider";
import { iAuth } from "../Types/creatorStuffTypes";
import Loader from "./Loader";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    // Avoids unwanted call to verifyRefreshToken
    !(auth as iAuth)?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false) as unknown as void;
  }, [auth, refresh]);

  return <>{isLoading ? <Loader /> : <Outlet />}</>;
};

export default PersistLogin;
