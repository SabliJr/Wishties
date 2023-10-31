import React from "react";
import "./header.css";

import Logo from "../../Assets/xLogo.png";

//Icons
import { HiShoppingCart } from "react-icons/hi";
import { FaClipboardList } from "react-icons/fa";
import { FaUserGear } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className='wishNav'>
        <img
          src={Logo}
          alt='wishlistLogo'
          className='wishlistLogo'
          onClick={() => navigate("/")}
        />
        <div className='iconsDiv'>
          <div className='userDiv'>
            <p className='wishItems'>0</p>
            <HiShoppingCart className='wishIcon' />
          </div>
          <FaClipboardList className='wishIcon' />
          <FaUserGear className='wishIcon' />
        </div>
      </div>
    </>
  );
};

export default Index;
