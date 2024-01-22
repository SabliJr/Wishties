import React, { useContext, useEffect, useState } from "react";

import Footer from "../Components/Footer/index";
import CreatorPage from "../Container/Public/CreatorPage";
import Header from "../Components/TheHeader/index";

import { onGetCreatorInfo } from "../API/authApi";
import { GlobalValuesContext } from "../Context/globalValuesContextProvider";
import { iGlobalValues } from "../Types/creatorSocialLinksTypes";
import Loader from "../utils/Loader";

const CreatorPublicPage = () => {
  const [isPublicDataLoading, setIsPublicDataLoading] = useState(true);
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { setCreatorInfo, setCreatorWishes, setCreatorSocialLinks } =
    contextValues as iGlobalValues;
  let creator_username = window.location.pathname.split("/")[1];

  useEffect(() => {
    (async () => {
      try {
        const res = await onGetCreatorInfo(creator_username);

        setCreatorInfo(res.data.user_info);
        setCreatorSocialLinks(res.data.user_links);
        setCreatorWishes(res.data.user_wishes);
        setIsPublicDataLoading(false);
      } catch (error) {
        console.log(error);
        setIsPublicDataLoading(false);
      }
    })();
  }, [
    creator_username,
    setIsPublicDataLoading,
    setCreatorInfo,
    setCreatorSocialLinks,
    setCreatorWishes,
  ]);

  return (
    <>
      {isPublicDataLoading ? (
        <Loader />
      ) : (
        <>
          <Header />
          <CreatorPage />
          <Footer />
        </>
      )}
    </>
  );
};

export default CreatorPublicPage;
