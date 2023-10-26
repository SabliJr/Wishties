import React from "react";
import "../Components/Register/Register.css";

import Header from "../Components/TheHeader/index";
import SignUp from "../Components/Register/SignUp";

const Pricing = () => {
  const date = new Date().getFullYear();

  return (
    <div>
      <Header />
      <SignUp />

      <div className='copyDiv'>
        <p>Wisties &copy;{date}</p>
      </div>
    </div>
  );
};

export default Pricing;
