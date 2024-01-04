import React, { useState, useContext, createContext, useEffect } from "react";
import { iCreatorSocialLinks } from "../Types/creatorSocialLinksTypes";
import { onGetSocialLinks } from "../API/authApi";

interface userInfoType {
  creatorSocialLinks?: iCreatorSocialLinks[] | undefined;
  userEmail: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  setCreatorSocialLinks: React.Dispatch<
    React.SetStateAction<iCreatorSocialLinks[]>
  >;
  displayedSocialLinks: iCreatorSocialLinks[];
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
  const [userEmail, setUserEmail] = useState("");
  const [creatorSocialLinks, setCreatorSocialLinks] = useState<
    iCreatorSocialLinks[]
  >([]); // Create a state for social links
  const [displayedSocialLinks, setDisplayedSocialLinks] =
    useState(creatorSocialLinks);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const res = await onGetSocialLinks();
        setCreatorSocialLinks(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSocialLinks();
  }, []);

  return (
    <userInfoContext.Provider
      value={{
        creatorSocialLinks,
        setCreatorSocialLinks,
        userEmail,
        setUserEmail,
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
    creatorSocialLinks,
    userEmail,
    setUserEmail,
    setCreatorSocialLinks,
    displayedSocialLinks,
    setDisplayedSocialLinks,
  } = userContext;
  return {
    creatorSocialLinks,
    setCreatorSocialLinks,
    userEmail,
    setUserEmail,
    displayedSocialLinks,
    setDisplayedSocialLinks,
  };
}

export { UserProfileContextProvider, useUserInfoCOntext };
