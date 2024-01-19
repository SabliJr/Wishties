import React, { useState, createContext } from "react";
import { iGlobalValues, cartProps } from "../Types/creatorSocialLinksTypes";

const GlobalValuesContext = createContext<iGlobalValues | {}>({});

const GlobalValuesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userEmail, setUserEmail] = useState("");
  const [reverificationSuccess, setReverificationSuccess] = useState("");
  const [serverErrMsg, setServerErrMsg] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [cartItems, setCartItems] = useState<cartProps>({
    cart: [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
  });

  console.log("cartItems", cartItems);

  return (
    <GlobalValuesContext.Provider
      value={{
        userEmail,
        setUserEmail,
        reverificationSuccess,
        setReverificationSuccess,
        serverErrMsg,
        setServerErrMsg,
        refresh,
        setRefresh,
        cartItems,
        setCartItems,
      }}>
      {children}
    </GlobalValuesContext.Provider>
  );
};

export { GlobalValuesProvider, GlobalValuesContext };
