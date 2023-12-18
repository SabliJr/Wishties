import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

import Logo from "../../Assets/xLogo.png";
import { RiMenu4Line } from "react-icons/ri";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleTrigger = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  return (
    <header className='Header'>
      <Link to='/'>
        <img src={Logo} alt='' className='logo' />
      </Link>
      <div className={`navStuff ${isOpen ? "navStaff expand" : ""}`}>
        <nav>
          <li>
            <Link to='/wishlist/:username'>Create Wishlist</Link>
          </li>
        </nav>
        <div className='navButtons'>
          <p>
            <Link to='/login'>Login</Link>
          </p>
          <button onClick={() => navigate("/signUp")}>SignUp</button>
        </div>
      </div>
      <RiMenu4Line className='menuIcon' onClick={handleTrigger} />
    </header>
  );
};

export default Index;
