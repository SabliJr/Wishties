import React, { createContext, useContext, ReactNode } from "react";
import { iWishInfo } from "../Types/wishListTypes";

interface WishInfoContextType {
  theWishes?: iWishInfo[] | undefined;
}

const wishInfoContext = createContext<WishInfoContextType | undefined>(
  undefined
);

const WishInfoContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const theWishes: iWishInfo[] = [];
  console.log(theWishes);

  return (
    <wishInfoContext.Provider value={{ theWishes }}>
      {children}
    </wishInfoContext.Provider>
  );
};

function useWishInfoContext(): WishInfoContextType {
  const context = useContext(wishInfoContext);

  if (!context) {
    throw new Error(
      "useWishInfoContext must be used within a WishInfoContextProvider"
    );
  }

  const { theWishes } = context;
  return { theWishes };
}

export { useWishInfoContext, WishInfoContextProvider, wishInfoContext };
