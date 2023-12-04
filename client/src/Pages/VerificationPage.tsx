import React from "react";

import Verify from "../Components/Verification/Verify";
import Navbar from "../Components/TheHeader/index";
import Footer from "../Components/Footer/index";

const VerificationPage = () => {
  return (
    <div className='verificationPage'>
      <Navbar />
      <Verify />
      <Footer />
    </div>
  );
};

export default VerificationPage;
