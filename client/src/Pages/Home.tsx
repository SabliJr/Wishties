import React from "react";
import "../App.css";

import Header from "../Components/TheHeader/index";
import Hero from "../Components/Hero/index";
import Promo from "../Components/Promo/index";
import Middle from "../Components/Middle/index";
import Features from "../Components/Features/index";
import BeforeTheFooter from "../Components/BeforeTheFooter/index";
import Footer from "../Components/Footer/index";

const Home = () => {
  return (
    <div className='Home'>
      <Header />
      <Hero />
      <Promo />
      <Middle />
      <Features />
      <BeforeTheFooter />
      <Footer />
    </div>
  );
};

export default Home;
