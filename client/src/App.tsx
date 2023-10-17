import React from "react";
import "./App.css";

import Header from "./Components/TheHeader/index";
import Hero from "./Components/Hero/index";
import Promo from "./Components/Promo/index";

const App = () => {
  return (
    <div className='App'>
      <Header />
      <Hero />
      <Promo />
    </div>
  );
};

export default App;
