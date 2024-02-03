import { onRefreshToken } from "../API/authApi";

const useRefreshToken = () => {
  const refresh = async () => {
    try {
      const response = await onRefreshToken();

      return response.data.accessToken;
    } catch (error) {
      if (error) {
        localStorage.removeItem("user_info");
      }
    }
  };

  return refresh;
};

export default useRefreshToken;
