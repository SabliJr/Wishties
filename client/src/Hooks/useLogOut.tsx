import { onLogout } from "../API/authApi";

import { useAuth } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const { dispatch } = useAuth();
  let navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await onLogout();
      console.log(res);

      if (res?.status === 200) {
        dispatch({ type: "LOGOUT" });
        // window.location.reload();
        navigate("/");
      }

      // dispatch({ type: "LOGOUT" });
    } catch (err: any) {
      if (err.response) {
        alert(err?.response?.data);
      }

      if (err?.response?.status === 404) {
        alert("SORRY, WE COULDN'T FIND THAT PAGE");
      } else if (err?.response?.status === 500) {
        alert("Something went wrong");
      } else {
        alert("Something went wrong");
      }
      
      dispatch({ type: "LOGOUT" });
    }
  };

  return logout;
};

export default useLogout;
