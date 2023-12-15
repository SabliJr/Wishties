import React, {
  createContext,
  useContext,
  useState,
  useDebugValue,
} from "react";

import { iAuth } from "../Types/creatorSocialLinksTypes";

interface AuthContextProps {
  isAuthenticated: boolean;
  // logout: () => void;
  auth: iAuth | {};
  setAuth: React.Dispatch<React.SetStateAction<{} | iAuth>>;
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [auth, setAuth] = useState({});

  const isAuthenticated: boolean = !!userId;
  console.log("isAuthenticated", isAuthenticated);
  // console.log("auth", auth);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        auth,
        setAuth,
        userId,
        setUserId,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  useDebugValue(context.auth, (auth) =>
    ((auth as iAuth)?.userId as string) ? "Logged In" : "Logged Out"
  );
  return context;
};
