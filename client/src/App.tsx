import React from "react";
import "./App.css";

import Header from "./Components/TheHeader/index";
import Hero from "./Components/Hero/index";
import Promo from "./Components/Promo/index";
import Middle from "./Components/Middle/index";
import YourData from "./Components/YouData/index";

const App = () => {
  return (
    <div className='App'>
      <Header />
      <Hero />
      <Promo />
      <Middle />
      <YourData />
    </div>
  );
};

export default App;
