import React, { useContext, useEffect, useState } from "react";

import CreatorPage from "../Container/Public/CreatorPage";
import Loader from "../utils/Loader";
import Errors from "../Pages/Errors";

import { onGetCreatorInfo } from "../API/authApi";
import { GlobalValuesContext } from "../Context/globalValuesContextProvider";
import { iGlobalValues } from "../Types/globalVariablesTypes";
import { iCart } from "../Types/wishListTypes";
import Skeleton from "../utils/Skeleton";

const CreatorPublicPage = () => {
  const [isPublicDataLoading, setIsPublicDataLoading] = useState(true);
  const [getCategories, setGetCategories] = useState<string[] | null>([]);
  const [userWishes, setUserWishes] = useState<iCart[]>([]);
  const [error, setError] = useState("");
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const {
    setCreatorInfo,
    setCreatorWishes,
    setCreatorSocialLinks,
    selectedFilter,
    selectedCategories,
    setSelectedCategories,
  } = contextValues as iGlobalValues;
  let creator_username = window.location.pathname.split("/")[2];

  useEffect(() => {
    (async () => {
      try {
        const res = await onGetCreatorInfo(creator_username);

        setCreatorInfo(res.data.user_info);
        setCreatorSocialLinks(res.data.user_links);
        setUserWishes(res.data.user_wishes);

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
      } catch (error: any) {
        if (error?.response?.status === 404) {
          setError(error?.response?.data);
        } else if (error?.message === "Network Error") {
          setError("Network Error");
        } else {
          setError("Something went wrong!");
        }
        setIsPublicDataLoading(false);
      }
    })();
  }, [
    creator_username,
    setIsPublicDataLoading,
    setCreatorInfo,
    setCreatorSocialLinks,
    setCreatorWishes,
    selectedFilter,
    selectedCategories,
    setSelectedCategories,
  ]);

  // useEffect(() => {
  //   if (userWishes && userWishes) {
  //     const filteredItems = userWishes.filter(
  //       (wish: iCart) =>
  //         selectedCategories.includes(wish.wish_category as string) ||
  //         selectedCategories.includes("All")
  //     );

  //     selectedFilter === "Default"
  //       ? setCreatorWishes(filteredItems)
  //       : selectedFilter === "LowToHigh"
  //       ? setCreatorWishes(
  //           filteredItems
  //             .sort
  //             (a: iCart, b: iCart) => a.wish_price - b.wish_price
  //         )
  //       : selectedFilter === "HighToLow"
  //       ? setCreatorWishes(
  //           filteredItems
  //             .sort
  //             (a: iCart, b: iCart) => b.wish_price - a.wish_price
  //         )
  //       : selectedFilter === "MostRecent"
  //       ? setCreatorWishes(
  //           filteredItems.sort((a: iCart, b: iCart) =>
  //             a.created_date && b.created_date
  //               ? new Date(b.created_date).getTime() -
  //                 new Date(a.created_date).getTime()
  //               : 0
  //           )
  //         )
  //       : selectedFilter === "Oldest"
  //       ? setCreatorWishes(
  //           filteredItems.sort((a: iCart, b: iCart) =>
  //             a.created_date && b.created_date
  //               ? new Date(a.created_date).getTime() -
  //                 new Date(b.created_date).getTime()
  //               : 0
  //           )
  //         )
  //       : setCreatorWishes(filteredItems);
  //   }
  // }, [selectedCategories, selectedFilter, userWishes]);

  return (
    <>
      {isPublicDataLoading ? (
        <Loader />
      ) : error ? (
        <Errors error={error} />
      ) : (
        <Skeleton>
          <CreatorPage getCategories={getCategories} />
        </Skeleton>
      )}
    </>
  );
};

export default CreatorPublicPage;
