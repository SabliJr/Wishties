import React, { createContext, useContext, useState } from "react";

interface AuthContextProps {
  userId: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isCreator: boolean;
  setIsCreator: React.Dispatch<React.SetStateAction<boolean>>;
  login: (userId: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState<boolean>(false);

  const isAuthenticated = !!userId;
  const login = (newUserId: string, newUsername: string) => {
    setUserId(newUserId);
    setUsername(newUsername);
  };

  console.log("userId", userId);
  console.log("isAuth", isAuthenticated);
  console.log("isCreator", isCreator);
  console.log("Login", login);

  const logout = () => {
    setUserId(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        username,
        isAuthenticated,
        isCreator,
        setIsCreator,
        login,
        logout,
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
