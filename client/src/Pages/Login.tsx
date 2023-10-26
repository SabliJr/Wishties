import React from "react";
import "../Components/Register/Register.css";

import Header from "../Components/TheHeader/index";
import Login from "../Components/Register/Login";

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
