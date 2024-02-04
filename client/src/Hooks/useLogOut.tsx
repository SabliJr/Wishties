import { onLogout } from "../API/authApi";

import { useAuth } from "../Context/AuthProvider";

const useLogout = () => {
  const { dispatch } = useAuth();

  const logout = async () => {
    try {
      await onLogout();

      dispatch({ type: "LOGOUT" });
    } catch (err: any) {
      if (err.response) {
        alert(err.response.data);
      }
      dispatch({ type: "LOGOUT" });
    }
  };

  return logout;
};

export default useLogout;
