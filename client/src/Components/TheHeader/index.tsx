import React, { useState } from "react";
import "./Header.css";

import Logo from "../../Assets/xLogo.png";
import { RiMenu4Line } from "react-icons/ri";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleTrigger = () => setIsOpen(!isOpen);

  return (
    <header className='Header'>
      <img src={Logo} alt='' className='logo' />
      <div className={`navStuff ${isOpen ? "navStaff expand" : ""}`}>
        <nav>
          <li>Links</li>
          <li>Whish List</li>
          <li>Pricing</li>
        </nav>
        <div className='navButtons'>
          <button>SignUp</button>
        </div>
      </div>
      <RiMenu4Line className='menuIcon' onClick={handleTrigger} />
    </header>
  );
};

export default Index;
