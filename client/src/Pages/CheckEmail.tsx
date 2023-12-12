import React, { useContext } from "react";
import { GlobalValuesContext } from "../Context/globalValuesContextProvider";
import { iGlobalValues } from "../Types/creatorSocialLinksTypes";
import "../App.css";

import Navbar from "../Components/TheHeader/index";
import Footer from "../Components/Footer/index";

const CheckEmail = () => {
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { reverificationSuccess } = contextValues as iGlobalValues;

  return (
    <div className='checkYourEmailPage'>
      <Navbar />
      <div className='msgContainer'>
        <div>
          <h1>Your Email 😊</h1>
          <p>{reverificationSuccess}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckEmail;
