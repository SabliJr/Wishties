import React from "react";
import "../Components/Login/Login.css";

import Header from "../Components/TheHeader/index";
import Login from "../Components/Login/index";
import Footer from "../Components/Footer/index";

const Pricing = () => {
  const date = new Date().getFullYear();

  return (
    <div>
      <Header />
      <Login />

      <div className='copyDiv'>
        <p>Wisties &copy;{date}</p>
      </div>
    </div>
  );
};

export default Pricing;
