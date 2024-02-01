import { onLogout } from "../API/authApi";

const useLogout = () => {
  const logout = async () => {
    try {
      await onLogout();
      localStorage.removeItem("user_info");
      window.location.href = "/";

    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
