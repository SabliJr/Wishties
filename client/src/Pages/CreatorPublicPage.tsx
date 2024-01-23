import React, { useContext, useEffect, useState } from "react";

import Footer from "../Components/Footer/index";
import CreatorPage from "../Container/Public/CreatorPage";
import Header from "../Components/TheHeader/index";

import { onGetCreatorInfo } from "../API/authApi";
import { GlobalValuesContext } from "../Context/globalValuesContextProvider";
import { iGlobalValues } from "../Types/creatorSocialLinksTypes";
import Loader from "../utils/Loader";
import Errors from "../Pages/Errors";

const CreatorPublicPage = () => {
  const [isPublicDataLoading, setIsPublicDataLoading] = useState(true);
  const [error, setError] = useState("");
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
      } catch (error: any) {
        if (error?.response?.status === 404) {
          setError(error?.response?.data);
        } else if (error?.message === "Network Error") {
          setError("Network Error");
        } else {
          setError("Something went wrong!");
        }
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
      ) : error ? (
        <Errors error={error} />
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
