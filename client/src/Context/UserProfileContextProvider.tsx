import React, { useState, useContext, createContext, useEffect } from "react";
import { iCreatorSocialLinks } from "../Types/creatorStuffTypes";
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
  setRefetchIcons: React.Dispatch<React.SetStateAction<boolean>>;
  refetchIcons: boolean;
  refetchCreatorData: Boolean;
  setRefetchCreatorData: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [refetchIcons, setRefetchIcons] = useState(false);
  const [refetchCreatorData, setRefetchCreatorData] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await onGetSocialLinks();
        setCreatorSocialLinks(res.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    setDisplayedSocialLinks(creatorSocialLinks);
  }, [creatorSocialLinks]);

  return (
    <userInfoContext.Provider
      value={{
        creatorSocialLinks,
        setCreatorSocialLinks,
        userEmail,
        setUserEmail,
        displayedSocialLinks,
        setDisplayedSocialLinks,
        refetchIcons,
        setRefetchIcons,
        refetchCreatorData,
        setRefetchCreatorData,
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
    refetchIcons,
    setRefetchIcons,
    refetchCreatorData,
    setRefetchCreatorData,
  } = userContext;
  return {
    creatorSocialLinks,
    setCreatorSocialLinks,
    userEmail,
    setUserEmail,
    displayedSocialLinks,
    setDisplayedSocialLinks,
    refetchIcons,
    setRefetchIcons,
    refetchCreatorData,
    setRefetchCreatorData,
  };
}

export { UserProfileContextProvider, useUserInfoCOntext };
