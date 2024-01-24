import React from "react";
import "../App.css";

import Hero from "../Components/Hero/index";
import Promo from "../Components/Promo/index";
import Middle from "../Components/Middle/index";
import Features from "../Components/Features/index";
import BeforeTheFooter from "../Components/BeforeTheFooter/index";
import Skeleton from "../utils/Skeleton";

const Home = () => {
  return (
    <Skeleton>
      <div className='Home'>
        <Hero />
        <Promo />
        <Middle />
        <Features />
        <BeforeTheFooter />
      </div>
    </Skeleton>
  );
};

export default Home;
