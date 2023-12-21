import { useAuth } from "../Context/authCntextProvider";
import { onRefreshToken } from "../API/authApi";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
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
  };

  return refresh;
};

export default useRefreshToken;
