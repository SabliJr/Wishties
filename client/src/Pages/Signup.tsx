import React from "react";

import Header from "../Components/TheHeader/index";
import SignUp from "../Components/Register/SignUp";
import TheFooter from "../Components/Footer/index";

const Pricing = () => {
  return (
    <div
      style={{
        maxWidth: "1180px",
        margin: "auto",
      }}>
      <Header />
      <SignUp />
      <TheFooter />
    </div>
  );
};

export default Pricing;
