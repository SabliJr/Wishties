import { useContext } from "react";
import UserProfile from "../Container/Profile/index";

import { UserProfileContextProvider } from "../Context/UserProfileContextProvider";
import { WishInfoContextProvider } from "../Context/wishInfoContextProvider";
import { GlobalValuesContext } from "../Context/globalValuesContextProvider";
import { iGlobalValues } from "../Types/globalVariablesTypes";

import Skeleton from "../utils/Skeleton";
import Loader from "../utils/Loader";

const WishList = () => {
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { isPublicDataLoading, refetchCreatorData } =
    contextValues as iGlobalValues;

  return (
    <WishInfoContextProvider>
      <UserProfileContextProvider>
        {isPublicDataLoading ? (
          <Loader />
        ) : (
          !isPublicDataLoading &&
          !refetchCreatorData && (
            <Skeleton>
              <UserProfile />
            </Skeleton>
          )
        )}
      </UserProfileContextProvider>
    </WishInfoContextProvider>
  );
};

export default WishList;
