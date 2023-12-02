import React, { useState, useContext, createContext } from "react";
import { iUserInfo } from "../Types/wishListTypes";
import { iCreatorSocialLinks } from "../Types/creatorSocialLinksTypes";

  const creatorSocialLinks: iCreatorSocialLinks[] = []; //Create a state for social links
interface userInfoType {
  userInfo: iUserInfo | undefined;
  setUserInfo: React.Dispatch<React.SetStateAction<iUserInfo | undefined>>;
  creatorSocialLinks?: iCreatorSocialLinks[] | undefined;
  displayedSocialLinks: iCreatorSocialLinks[] | undefined;
  setDisplayedSocialLinks: React.Dispatch<
    React.SetStateAction<iCreatorSocialLinks[]>
  >;
}

const userInfoContext = createContext<userInfoType | undefined>(undefined);

const UserProfileContextProvider = ({
  children,
}: {
  children: React.ReactNode;
  }): JSX.Element => {
    //Creator profile info edit
    const [userInfo, setUserInfo] = useState<iUserInfo | undefined>({
      coverPhoto: "",
      profilePhoto: "",
      profileName: "",
      userName: "",
      userBio: "",
    });

  const [displayedSocialLinks, setDisplayedSocialLinks] = useState(creatorSocialLinks);

    return (
      <userInfoContext.Provider
        value={{
          userInfo,
          setUserInfo,
          creatorSocialLinks,
          displayedSocialLinks,
          setDisplayedSocialLinks,
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

  const {
    userInfo,
    setUserInfo,
    creatorSocialLinks,
    displayedSocialLinks,
    setDisplayedSocialLinks,
  } = userContext;
  return {
    userInfo,
    setUserInfo,
    creatorSocialLinks,
    displayedSocialLinks,
    setDisplayedSocialLinks,
  };
}

export { UserProfileContextProvider, useUserInfoCOntext };
