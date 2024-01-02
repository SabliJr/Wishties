import React, { useState, useContext, createContext } from "react";
import { iCreatorSocialLinks } from "../Types/creatorSocialLinksTypes";

interface userInfoType {
  creatorSocialLinks?: iCreatorSocialLinks[] | undefined;
  userEmail: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
}

const userInfoContext = createContext<userInfoType | undefined>(undefined);

const UserProfileContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [userEmail, setUserEmail] = useState("");
  const creatorSocialLinks: iCreatorSocialLinks[] = []; //Create a state for social links

  return (
    <userInfoContext.Provider
      value={{
        creatorSocialLinks,
        userEmail,
        setUserEmail,
      }}>
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

  const { creatorSocialLinks, userEmail, setUserEmail } = userContext;
  return {
    creatorSocialLinks,
    userEmail,
    setUserEmail,
  };
}

export { UserProfileContextProvider, useUserInfoCOntext };
