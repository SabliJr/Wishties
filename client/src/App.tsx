import React from "react";
import "./App.css";

import Header from "./Components/TheHeader/index";
import Hero from "./Components/Hero/index";
import Promo from "./Components/Promo/index";
import Middle from "./Components/Middle/index";

const App = () => {
  return (
    <div className='App'>
      <Header />
      <Hero />
      <Promo />
      <Middle />
    </div>
  );
};

export default App;
