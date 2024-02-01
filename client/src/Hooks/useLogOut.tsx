import { onLogout } from "../API/authApi";

const useLogout = () => {
  const logout = async () => {
    try {
      await onLogout();
      localStorage.removeItem("user_info");
      window.location.href = "/";

    } catch (err) {
      localStorage.removeItem("user_info");
    }
  };

  return logout;
};

export default useLogout;
