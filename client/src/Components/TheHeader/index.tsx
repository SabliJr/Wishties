import React from "react";
import "./Header.css";

import Logo from "../../Assets/zLast2.png";
import { RiMenu4Line } from "react-icons/ri";

const Index = () => {
  return (
    <header className='Header'>
      <img src={Logo} alt='' className='logo' />
      <div className='navStuff'>
        <nav>
          <li>Links</li>
          <li>Whish List</li>
          <li>Pricing</li>
        </nav>
        <div className='navButtons'>
          <button>SignUp</button>
        </div>
      </div>
      <RiMenu4Line className='menuIcon' />
    </header>
  );
};

export default Index;
