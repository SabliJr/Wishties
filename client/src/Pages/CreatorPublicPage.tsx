import React from "react";

import Footer from "../Components/Footer/index";
import CreatorPage from "../Container/Public/CreatorPage";
import Header from "../Components/TheHeader/index";

const CreatorPublicPage = () => {
  return (
    <main className='creator_public_page'>
      <Header />
      <CreatorPage />
      <Footer />
    </main>
  );
};

export default CreatorPublicPage;
