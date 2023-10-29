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
            <Link to='/links'>Link in bio</Link>
          </li>
          <li>
            <Link to='/wishlist'>Create Wishlist</Link>
          </li>
          {/* <li> */}
          {/* <Link to='/login'>LogIn</Link> */}
          {/* </li> */}
        </nav>
        <div className='navButtons'>
          <button onClick={() => navigate("/signup")}>SignUp</button>
        </div>
      </div>
      <RiMenu4Line className='menuIcon' onClick={handleTrigger} />
    </header>
  );
};

export default Index;
