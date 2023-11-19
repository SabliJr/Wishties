import React, { useState, useContext, createContext } from "react";
import { iUserInfo } from "../Types/wishListTypes";
import { iCreatorSocialLinks } from "../Types/creatorSocialLinksTypes";

interface userInfoType {
  userInfo: iUserInfo | undefined;
  setUserInfo: React.Dispatch<React.SetStateAction<iUserInfo | undefined>>;
  creatorSocialLinks?: iCreatorSocialLinks[] | undefined;
}

const userInfoContext = createContext<userInfoType | undefined>(undefined);

const UserProfileContextProvider = ({
  children,
}: {
  children: React.ReactNode;
  }): JSX.Element => {
  const creatorSocialLinks: iCreatorSocialLinks[] = []; //Create a state for social links
  const [userInfo, setUserInfo] = useState<iUserInfo | undefined>({
    coverPhoto: "",
    profilePhoto: "",
    profileName: "",
    userName: "",
    userBio: "",
  }); //Create a state for user info

  return (
    <userInfoContext.Provider
      value={{ userInfo, setUserInfo, creatorSocialLinks }}>
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

  const { userInfo, setUserInfo, creatorSocialLinks } = userContext;
  return { userInfo, setUserInfo, creatorSocialLinks };
}

export { UserProfileContextProvider, useUserInfoCOntext };
