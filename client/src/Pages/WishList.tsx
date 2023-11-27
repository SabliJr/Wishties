import React from "react";
import WishListHeader from "../Container/TheHeader/index";
import UserProfile from "../Container/Profile/index";

import TheFooter from "../Components/Footer/index";
import { UserProfileContextProvider } from "../Context/UserProfileContextProvider";
import { WishInfoContextProvider } from "../Context/wishInfoContextProvider";

const WishList = () => {
  return (
      <WishInfoContextProvider>
        <UserProfileContextProvider>
          <WishListHeader />
          <UserProfile />
          <TheFooter />
        </UserProfileContextProvider>
      </WishInfoContextProvider>
  );
};

export default WishList;
