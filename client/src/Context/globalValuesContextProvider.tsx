import React, { useState, createContext } from "react";
import {
  iCreatorSocialLinks,
  iCreatorProfile,
} from "../Types/creatorStuffTypes";
import { iCart, cartProps } from "../Types/wishListTypes";
import { iGlobalValues } from "../Types/globalVariablesTypes";

const GlobalValuesContext = createContext<iGlobalValues | {}>({});

const GlobalValuesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userEmail, setUserEmail] = useState("");
  const [reverificationSuccess, setReverificationSuccess] = useState("");
  const [serverErrMsg, setServerErrMsg] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Default");
  const [displayFilters, setDisplayFilters] = useState(false);
  const [displayCategories, setDisplayCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All",
  ]);

  const [cartItems, setCartItems] = useState<cartProps>({
    cart: (() => {
      const cart = localStorage.getItem("cart_items");
      return cart ? JSON.parse(cart) : [];
    })(),
    cartTotalQuantity: (() => {
      const cart_total_quantity = localStorage.getItem("cart_total_quantity");
      return cart_total_quantity ? JSON.parse(cart_total_quantity) : 0;
    })(),
    cartTotalAmount: (() => {
      const cart_total_amount = localStorage.getItem("cart_total_amount");
      return cart_total_amount ? JSON.parse(cart_total_amount) : 0;
    })(),
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
        selectedFilter,
        setSelectedFilter,
        displayFilters,
        setDisplayFilters,
        selectedCategories,
        setSelectedCategories,
        displayCategories,
        setDisplayCategories,
      }}>
      {children}
    </GlobalValuesContext.Provider>
  );
};

export { GlobalValuesProvider, GlobalValuesContext };
