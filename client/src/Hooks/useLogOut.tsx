import { useAuth } from "../Context/authCntextProvider";
import { onLogout } from "../API/authApi";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      await onLogout();
      localStorage.removeItem("user_info");
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
