import { onLogout } from "../API/authApi";

const useLogout = () => {
  const logout = async () => {
    try {
      await onLogout();
      localStorage.removeItem("user_info");
      console.log("Logged out");
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
