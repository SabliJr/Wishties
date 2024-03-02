import React from "react";

import { onRefreshToken } from "../API/authApi";
import { useAuth } from "../Context/AuthProvider";

const useRefreshToken = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const { dispatch } = useAuth();

  const refresh = async () => {
    setIsLoading(true);
    setError(null);
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

      return response.data.accessToken;
    } catch (error: any) {
      setError(error.response.data.message);
      if (error) {
        localStorage.removeItem("user_info");
        dispatch({ type: "LOGOUT" });
        alert("Session expired, please login again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { refresh, isLoading, error };
};

export default useRefreshToken;
