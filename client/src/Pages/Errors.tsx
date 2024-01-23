import React from "react";
import "./Pages.css";

import Header from "../Components/TheHeader/index";
import Footer from "../Components/Footer/index";

const Errors = ({ error }: { error: string }) => {
  return (
    <>
      <Header />
      <div className='_error_page'>
        <h1>Error! 😧</h1>
        <p>{error}</p>
      </div>
      <Footer />
    </>
  );
};

export default Errors;
