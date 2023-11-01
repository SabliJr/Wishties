import React from "react";

import Header from "../Components/TheHeader/index";
import Login from "../Components/Register/Login";
import Footer from "../Components/Footer/index";

const Pricing = () => {
  return (
    <div
      style={{
        maxWidth: "1180px",
        margin: "auto",
      }}>
      <Header />
      <Login />
      <Footer />
    </div>
  );
};

export default Pricing;
