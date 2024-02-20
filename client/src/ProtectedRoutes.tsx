import { useEffect, useState } from "react";

import Loader from "./utils/Loader";
import { useAuth } from "./Context/AuthProvider";
import { onRefreshToken } from "./API/authApi";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true); // This is for the loader
  const { state, dispatch } = useAuth();

  let location = useLocation();
  // let username = location.pathname.split("/")[2];

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
  }, [location]);

  return isLoading ? (
    <Loader />
  ) : (
    <>
      {state.accessToken ? ( //&& username === state.creator_username
        <Outlet />
      ) : (
        <Navigate to='/' />
      )}
    </>
  );
};

export default ProtectedRoute;
