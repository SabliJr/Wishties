import React from "react";

import Header from "../Components/TheHeader/index";
import Footer from "../Components/Footer/index";

const Skeleton = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Skeleton;
