// AuthContext.js
import {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
} from "react";
import { onRefreshToken } from "../API/authApi";

type AuthContextType = {
  state: iState;
  dispatch: React.Dispatch<iAction>;
  verificationEmail: string | undefined;
  setVerificationEmail: React.Dispatch<React.SetStateAction<string>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type iState = {
  isAuthenticated: boolean;
  accessToken: string | null;
  creator_id?: string;
  creator_username?: string;
};

type iAction = {
  type: string;
  payload?: {
    accessToken?: string;
    user_id?: string;
    creator_username?: string;
  };
};

const initialState = {
  isAuthenticated: false,
  accessToken: null,
};

const authReducer = (state: iState, action: iAction) => {
  switch (action.type) {
    case "LOGIN":
      return {
        isAuthenticated: true,
        accessToken: action.payload?.accessToken as string,
        creator_id: action.payload?.user_id,
        creator_username: action.payload?.creator_username,
      };
    case "LOGOUT":
      return {
        isAuthenticated: false,
        accessToken: null,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [verificationEmail, setVerificationEmail] = useState("");

    useEffect(() => {
      (async () => {
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
        } catch (error: any) {
          if (error.response?.status !== 403) {
          } else {
            dispatch({ type: "LOGOUT" });
          }
        }
      })();
    }, []);

  return (
    <AuthContext.Provider
      value={{ state, dispatch, verificationEmail, setVerificationEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
