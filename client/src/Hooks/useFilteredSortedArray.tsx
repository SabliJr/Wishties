import { useState, useEffect } from "react";

import { iCart } from "../Types/wishListTypes";

type Filter = string[];
const useFilteredSortedArray = (
  array: iCart[],
  filter: Filter,
  sortOrder: any
) => {
  const [filteredSortedArray, setFilteredSortedArray] = useState<iCart[]>([]);

  useEffect(() => {
    if (array && array.length > 0) {
      const filteredItems = array.filter(
        (item: iCart) =>
          filter.includes(item.wish_category as string) ||
          filter.includes("All")
      );

      let sortedItems;
      switch (sortOrder) {
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

      setFilteredSortedArray(sortedItems);
    }
  }, [array, filter, sortOrder]);

  return filteredSortedArray;
};

export default useFilteredSortedArray;
