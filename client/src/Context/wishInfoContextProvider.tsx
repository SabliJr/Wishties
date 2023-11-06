import React, { createContext, useContext, ReactNode } from "react";
import { iWishInfo } from "../Types/wishListTypes";

interface WishInfoContextType {
  Wishes?: iWishInfo[] | undefined;
}

const wishInfoContext = createContext<WishInfoContextType | undefined>(
  undefined
);

const WishInfoContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const Wishes: iWishInfo[] = [];

  return (
    <wishInfoContext.Provider value={{ Wishes }}>
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

  const { Wishes } = context;
  return { Wishes };
}

export { useWishInfoContext, WishInfoContextProvider, wishInfoContext };
