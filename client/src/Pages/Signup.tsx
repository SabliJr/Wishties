import React from "react";

import Header from "../Components/TheHeader/index";
import SignUp from "../Components/Register/SignUp";
import TheFooter from "../Components/Footer/index";

const SignUpPage = () => {
  return (
    <div className='signUpPage'>
      <Header />
      <SignUp />
      <TheFooter />
    </div>
  );
};

export default SignUpPage;
