import React, { useState, createContext } from "react";
import { iGlobalValues } from "../Types/creatorSocialLinksTypes";

const GlobalValuesContext = createContext<iGlobalValues | {}>({});

const GlobalValuesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userEmail, setUserEmail] = useState("");
  console.log(userEmail);

  return (
    <GlobalValuesContext.Provider
      value={{
        userEmail,
        setUserEmail,
      }}>
      {children}
    </GlobalValuesContext.Provider>
  );
};

export { GlobalValuesProvider, GlobalValuesContext };
