import React, { useState, createContext } from "react";
import {
  iGlobalValues,
  cartProps,
  iCart,
  iCreatorSocialLinks,
} from "../Types/creatorSocialLinksTypes";
import { iCreatorProfile } from "../Types/wishListTypes";

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

  const [creatorInfo, setCreatorInfo] = useState<iCreatorProfile>(
    {} as iCreatorProfile
  );
  const [creatorWishes, setCreatorWishes] = useState<iCart[]>([]);
  const [creatorSocialLinks, setCreatorSocialLinks] = useState<
    iCreatorSocialLinks[]
  >([]);

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
        creatorInfo,
        setCreatorInfo,
        creatorWishes,
        setCreatorWishes,
        creatorSocialLinks,
        setCreatorSocialLinks,
      }}>
      {children}
    </GlobalValuesContext.Provider>
  );
};

export { GlobalValuesProvider, GlobalValuesContext };
