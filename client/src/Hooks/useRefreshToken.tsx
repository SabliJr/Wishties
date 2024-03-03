import React from "react";

import { onRefreshToken } from "../API/authApi";
import { useAuth } from "../Context/AuthProvider";

const useRefreshToken = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { dispatch } = useAuth();

  const refresh = async () => {
    setIsLoading(true);
    try {
      const response = await onRefreshToken();

      if (response?.status === 200) {
        dispatch({
          type: "LOGIN",
          payload: {
            accessToken: response?.data?.accessToken,
            user_id: response?.data?.user?.creator_id,
            creator_username: response?.data?.user?.username,
          },
        });
      }

      return response?.data?.accessToken;
    } catch (error: any) {
      try {
        // localStorage.removeItem("user_info");
        dispatch({ type: "LOGOUT" });
      } catch (error: any) {
        if (error?.response.status !== 500) {
          alert(error?.response?.data.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { refresh, isLoading };
};

export default useRefreshToken;
