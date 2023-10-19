import React from "react";
import "./App.css";

import Header from "./Components/TheHeader/index";
import Hero from "./Components/Hero/index";
import Promo from "./Components/Promo/index";
import Middle from "./Components/Middle/index";
import Features from "./Components/Features/index";
import YourData from "./Components/YouData/index";
import BeforeTheFooter from "./Components/BeforeTheFooter/index";
import Footer from "./Components/Footer/index";

const App = () => {
  return (
    <div className='App'>
      <Header />
      <Hero />
      <Promo />
      <Middle />
      <Features />
      <YourData />
      <BeforeTheFooter />
      <Footer />
    </div>
  );
};

export default App;
