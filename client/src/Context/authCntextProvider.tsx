import React, { createContext, useContext, useState } from "react";

import { iAuth } from "../Types/creatorStuffTypes";

interface AuthContextProps {
  auth: iAuth | {};
  setAuth: React.Dispatch<React.SetStateAction<{} | iAuth>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState({});

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
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

  return context;
};
