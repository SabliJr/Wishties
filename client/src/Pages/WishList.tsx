import React from "react";
import WishListHeader from "../Container/TheHeader/index";
import UserProfile from "../Container/Profile/index";

import { WishInfoContextProvider } from "../Context/wishInfoContextProvider";

const WishList = () => {
  return (
    <WishInfoContextProvider>
      <WishListHeader />
      <UserProfile />
    </WishInfoContextProvider>
  );
};

export default WishList;
