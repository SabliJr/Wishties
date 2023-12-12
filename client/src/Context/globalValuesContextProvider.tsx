import React, { useState, createContext } from "react";
import { iGlobalValues } from "../Types/creatorSocialLinksTypes";

const GlobalValuesContext = createContext<iGlobalValues | {}>({});

const GlobalValuesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userEmail, setUserEmail] = useState("");
  const [reverificationSuccess, setReverificationSuccess] = useState("");
  const [serverErrMsg, setServerErrMsg] = useState("");

  return (
    <GlobalValuesContext.Provider
      value={{
        userEmail,
        setUserEmail,
        reverificationSuccess,
        setReverificationSuccess,
        serverErrMsg,
        setServerErrMsg,
      }}>
      {children}
    </GlobalValuesContext.Provider>
  );
};

export { GlobalValuesProvider, GlobalValuesContext };
