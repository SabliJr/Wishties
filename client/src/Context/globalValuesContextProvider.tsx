import React, { useState, createContext, useEffect } from "react";
import {
  iCreatorSocialLinks,
  iCreatorProfile,
} from "../Types/creatorStuffTypes";
import { iCart, cartProps } from "../Types/wishListTypes";
import { iGlobalValues } from "../Types/globalVariablesTypes";
import { onGetCreatorInfo } from "../API/authApi";

const GlobalValuesContext = createContext<iGlobalValues | {}>({});

const GlobalValuesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userEmail, setUserEmail] = useState("");
  const [reverificationSuccess, setReverificationSuccess] = useState("");
  const [serverErrMsg, setServerErrMsg] = useState("");
  // const [refresh, setRefresh] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Default");
  const [displayFilters, setDisplayFilters] = useState(false);
  const [displayCategories, setDisplayCategories] = useState(false);
  const [isPublicDataLoading, setIsPublicDataLoading] = useState(true);
  const [getCategories, setGetCategories] = useState<string[] | null>([]);

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
  const [refetchCreatorData, setRefetchCreatorData] = useState(false);

  const [error, setError] = useState("");
  const [creatorInfo, setCreatorInfo] = useState<iCreatorProfile>(
    {} as iCreatorProfile
  );
  const [creatorWishes, setCreatorWishes] = useState<iCart[]>([]);
  const [creatorSocialLinks, setCreatorSocialLinks] = useState<
    iCreatorSocialLinks[]
  >([]);
  // Add a new state variable for the filtered and sorted wishes
  const [filteredAndSortedWishes, setFilteredAndSortedWishes] = useState<
    iCart[]
  >([]);
  const [displayedSocialLinks, setDisplayedSocialLinks] =
    useState<iCreatorSocialLinks[]>(creatorSocialLinks);

  let creator_username = window.location.pathname.split("/")[2];

  useEffect(() => {
    (async () => {
      try {
        if (creator_username !== "undefined") {
          const res = await onGetCreatorInfo(creator_username);

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
        }
      } catch (error: any) {
        if (error?.response?.status === 404) {
          setError(error?.response?.data);
        } else if (error?.message === "Network Error") {
          setError("Network Error");
        } else {
          setError("Something went wrong!");
        }
        setIsPublicDataLoading(false);
        setRefetchCreatorData(false);
      }
    })();
  }, [
    creator_username,
    isPublicDataLoading,
    setCreatorInfo,
    setCreatorSocialLinks,
    setCreatorWishes,
    selectedFilter,
    selectedCategories,
    setSelectedCategories,
    refetchCreatorData,
  ]);

  useEffect(() => {
    if (creatorWishes && creatorWishes.length > 0) {
      const filteredItems = creatorWishes.filter(
        (wish: iCart) =>
          selectedCategories.includes(wish.wish_category as string) ||
          selectedCategories.includes("All")
      );

      let sortedItems;
      switch (selectedFilter) {
        case "LowToHigh":
          sortedItems = filteredItems.sort(
            (a: iCart, b: iCart) =>
              (a.wish_price as number) - (b.wish_price as number)
          );
          break;
        case "HighToLow":
          sortedItems = filteredItems.sort(
            (a: iCart, b: iCart) =>
              (b.wish_price as number) - (a.wish_price as number)
          );
          break;
        case "MostRecent":
          sortedItems = filteredItems.sort((a: iCart, b: iCart) =>
            a.created_date && b.created_date
              ? new Date(b.created_date).getTime() -
                new Date(a.created_date).getTime()
              : 0
          );
          break;
        case "Oldest":
          sortedItems = filteredItems.sort((a: iCart, b: iCart) =>
            a.created_date && b.created_date
              ? new Date(a.created_date).getTime() -
                new Date(b.created_date).getTime()
              : 0
          );
          break;
        default:
          sortedItems = filteredItems;
      }

      // Update the new state variable instead of creatorWishes
      setFilteredAndSortedWishes(sortedItems);
    }
  }, [selectedCategories, selectedFilter, creatorWishes]);

  useEffect(() => {
    setDisplayedSocialLinks(creatorSocialLinks);
  }, [creatorSocialLinks]);

  return (
    <GlobalValuesContext.Provider
      value={{
        userEmail,
        setUserEmail,
        reverificationSuccess,
        setReverificationSuccess,
        serverErrMsg,
        setServerErrMsg,
        // refresh,
        // setRefresh,
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
        getCategories,
        setGetCategories,
        filteredAndSortedWishes,
        isPublicDataLoading,
        refetchCreatorData,
        setRefetchCreatorData,
        displayedSocialLinks,
        setDisplayedSocialLinks,
      }}>
      {children}
    </GlobalValuesContext.Provider>
  );
};

export { GlobalValuesProvider, GlobalValuesContext };
