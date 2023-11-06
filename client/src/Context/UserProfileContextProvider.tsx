import React, { useState, useContext, createContext } from "react";
import { iUserInfo } from "../Types/wishListTypes";

interface userInfoType {
  userInfo: iUserInfo | undefined;
  setUserInfo: React.Dispatch<React.SetStateAction<iUserInfo | undefined>>;
}

const userInfoContext = createContext<userInfoType | undefined>(undefined);

const UserProfileContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [userInfo, setUserInfo] = useState<iUserInfo | undefined>({
    coverPhoto: "",
    profilePhoto: "",
    profileName: "",
    userName: "",
    userBio: "",
  });

  return (
    <userInfoContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </userInfoContext.Provider>
  );
};

function useUserInfoCOntext(): userInfoType {
  const userContext = useContext(userInfoContext);

  if (!userContext) {
    throw new Error(
      "userInfoContext must be used within a UserProfileContextProvider"
    );
  }

  const { userInfo, setUserInfo } = userContext;
  return { userInfo, setUserInfo };
}

export { UserProfileContextProvider, useUserInfoCOntext };
