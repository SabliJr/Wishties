import React, { useState, createContext, useEffect } from "react";
import {
  iCreatorSocialLinks,
  iCreatorProfile,
} from "../Types/creatorStuffTypes";
import { iCart, cartProps } from "../Types/wishListTypes";
import { iGlobalValues } from "../Types/globalVariablesTypes";
import { onGetCreatorInfo } from "../API/authApi";
import useFilteredSortedArray from "../Hooks/useFilteredSortedArray";

const GlobalValuesContext = createContext<iGlobalValues | {}>({});

const GlobalValuesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reverificationSuccess, setReverificationSuccess] = useState("");
  const [serverErrMsg, setServerErrMsg] = useState("");
  const [isPublicDataLoading, setIsPublicDataLoading] = useState(true);
  const [getCategories, setGetCategories] = useState<string[] | null>([]);

  // let pathname = window.location.pathname;

  const [cartItems, setCartItems] = useState<cartProps>({
    cart: (() => {
      const cart = localStorage.getItem("cart_items");
      return cart ? JSON.parse(cart) : [];
    })() as iCart[],
    cartTotalQuantity: (() => {
      const cart_total_quantity = localStorage.getItem("cart_total_quantity");
      return cart_total_quantity ? JSON.parse(cart_total_quantity) : 0;
    })(),
    cartTotalAmount: (() => {
      const cart_total_amount = localStorage.getItem("cart_total_amount");
      return cart_total_amount ? JSON.parse(cart_total_amount) : 0;
    })(),
    surpriseGift: (() => {
      const surprise_gift = localStorage.getItem("surprise_gift");
      return surprise_gift ? JSON.parse(surprise_gift) : [];
    })(),
  });

  const [refetchCreatorData, setRefetchCreatorData] = useState(false);
  const [displayFilters, setDisplayFilters] = useState(false);
  const [displayCategories, setDisplayCategories] = useState(false);

  const [globalError, setGlobalError] = useState("");
  const [creatorInfo, setCreatorInfo] = useState<iCreatorProfile>(
    {} as iCreatorProfile
  );
  const [creatorWishes, setCreatorWishes] = useState<iCart[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("Default");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All",
  ]);

  const [creatorSocialLinks, setCreatorSocialLinks] = useState<
    iCreatorSocialLinks[]
  >([]);

  let creator_username = window.location.pathname.split("/")[1];

  useEffect(() => {
    (async () => {
      try {
        if (creator_username !== undefined && creator_username !== "") {
          const res = await onGetCreatorInfo(creator_username as string);
          setCreatorInfo(res.data.user_info);
          setCreatorSocialLinks(res.data.user_links);
          setCreatorWishes(res.data.user_wishes);

          // Extract categories from the wishes
          const categories = Array.from(
            new Set(
              res.data.user_wishes
                .filter((wish: iCart) => wish.wish_category !== "undefined")
                .map((wish: iCart) => wish.wish_category)
            )
          );
          setGetCategories(categories as string[]);

          setIsPublicDataLoading(false);
          setRefetchCreatorData(false);
          setGlobalError("");
        }
      } catch (error: any) {
        if (error?.response?.status === 404) {
          setGlobalError("404");
        } else if (error?.message === "Network Error") {
          setGlobalError("Network Error");
        } else {
          setGlobalError("Something went wrong!");
        }
        setIsPublicDataLoading(false);
        setRefetchCreatorData(false);
      }
    })();
  }, [isPublicDataLoading, refetchCreatorData, creator_username]);

  const filteredAndSortedWishes = useFilteredSortedArray(
    creatorWishes,
    selectedCategories,
    selectedFilter
  );

  return (
    <GlobalValuesContext.Provider
      value={{
        reverificationSuccess,
        setReverificationSuccess,
        serverErrMsg,
        setServerErrMsg,
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
        selectedCategories,
        setSelectedCategories,
        getCategories,
        setGetCategories,
        filteredAndSortedWishes,
        isPublicDataLoading,
        refetchCreatorData,
        setRefetchCreatorData,
        globalError,
        displayFilters,
        setDisplayFilters,
        displayCategories,
        setDisplayCategories,
      }}>
      {children}
    </GlobalValuesContext.Provider>
  );
};

export { GlobalValuesProvider, GlobalValuesContext };
