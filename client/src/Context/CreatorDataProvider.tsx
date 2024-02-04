import React, { useContext, useState, useEffect } from "react";

import { onGetCreatorData } from "../API/authApi";
import useFilteredSortedArray from "../Hooks/useFilteredSortedArray";
import {
  iCreatorProfile,
  iCreatorSocialLinks,
  iCreatorDataProvider,
} from "../Types/creatorStuffTypes";
import { iCart } from "../Types/wishListTypes";

const CreatorDataContext = React.createContext<iCreatorDataProvider | {}>({});

const CreatorDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [creatorInfo, setCreatorInfo] = useState<iCreatorProfile>(
    {} as iCreatorProfile
  );
  const [creatorSocialLinks, setCreatorSocialLinks] = useState<
    iCreatorSocialLinks[]
  >([]);
  const [displayCategories, setDisplayCategories] = useState(false);
  const [displayFilters, setDisplayFilters] = useState(false);

  const [getCategories, setGetCategories] = useState<string[] | null>([]);
  const [creatorWishes, setCreatorWishes] = useState<iCart[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("Default");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All",
  ]);
  const [displayedSocialLinks, setDisplayedSocialLinks] =
    useState<iCreatorSocialLinks[]>(creatorSocialLinks);
  const [errLoadingWishes, setErrLoadingWishes] = useState("");
  const [refreshCreatorData, setRefreshCreatorData] = useState(false);

  const filteredAndSortedWishes = useFilteredSortedArray(
    creatorWishes,
    selectedCategories,
    selectedFilter
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await onGetCreatorData();
        setCreatorWishes(res.data.user_wishes);
        setCreatorInfo(res.data.user_info);
        setCreatorSocialLinks(res.data.user_links);

        const categories = Array.from(
          new Set(
            res.data.user_wishes
              .filter((wish: iCart) => wish.wish_category !== "undefined")
              .map((wish: iCart) => wish.wish_category)
          )
        );
        setGetCategories(categories as string[]);
        setRefreshCreatorData(false);
      } catch (error: any) {
        if (error?.response) {
          setErrLoadingWishes(error?.response?.massage);
          setRefreshCreatorData(false);
        }
      }
    })();
  }, [refreshCreatorData]);

  useEffect(() => {
    setDisplayedSocialLinks(creatorSocialLinks);
  }, [creatorSocialLinks]);

  return (
    <CreatorDataContext.Provider
      value={{
        creatorInfo,
        creatorSocialLinks,
        creatorWishes,
        selectedFilter,
        setSelectedFilter,
        selectedCategories,
        setSelectedCategories,
        getCategories,
        displayCategories,
        setDisplayCategories,
        displayFilters,
        setDisplayFilters,
        filteredAndSortedWishes,
        errLoadingWishes,
        displayedSocialLinks,
        setDisplayedSocialLinks,
        refreshCreatorData,
        setRefreshCreatorData,
      }}>
      {children}
    </CreatorDataContext.Provider>
  );
};

export const useCreatorData = () => {
  const context = useContext(CreatorDataContext);
  if (!context) {
    throw new Error("useCreatorData must be used within a CreatorDataProvider");
  }

  return useContext(CreatorDataContext);
};

export default CreatorDataProvider;
