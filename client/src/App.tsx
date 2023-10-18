import React from "react";
import "./App.css";

import Header from "./Components/TheHeader/index";
import Hero from "./Components/Hero/index";
import Promo from "./Components/Promo/index";
import Middle from "./Components/Middle/index";
import YourData from "./Components/YouData/index";
import BeforeTheFooter from "./Components/BeforeTheFooter/index";

const App = () => {
  return (
    <div className='App'>
      <Header />
      <Hero />
      <Promo />
      <Middle />
      <YourData />
      <BeforeTheFooter />
    </div>
  );
};

export default App;
