import React, { useContext } from "react";

import Skeleton from "../utils/Skeleton";
import CreatorPage from "../Container/Public/CreatorPage";

import { GlobalValuesContext } from "../Context/globalValuesContextProvider";
import { iGlobalValues } from "../Types/globalVariablesTypes";
import Loader from "../utils/Loader";

const CreatorWishlist = () => {
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { refetchCreatorData } = contextValues as iGlobalValues;

  return (
    <>
      {!refetchCreatorData ? (
        <Skeleton>
          <CreatorPage />
        </Skeleton>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default CreatorWishlist;
