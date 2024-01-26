import { useAuth } from "../Context/authCntextProvider";
import { onRefreshToken } from "../API/authApi";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await onRefreshToken();

      setAuth((prev) => {
        return {
          ...prev,
          userId: response.data.user.creator_id,
          username: response.data.user.username,
          accessToken: response.data.accessToken,
        };
      });
      return response.data.accessToken;
    } catch (error) {
      if (error) {
        setAuth((prev) => {
          return {
            ...prev,
            userId: null,
            username: null,
            accessToken: null,
          };
        });
      }
    }
 
  };

  return refresh;
};

export default useRefreshToken;
