import React from "react";
import WishListHeader from "../Container/TheHeader/index";
import UserProfile from "../Container/Profile/index";

import { WishInfoContextProvider } from "../Context/wishInfoContextProvider";
import TheFooter from "../Components/Footer/index";

const WishList = () => {
  return (
    <WishInfoContextProvider>
      <WishListHeader />
      <UserProfile />
      <TheFooter />
    </WishInfoContextProvider>
  );
};

export default WishList;
