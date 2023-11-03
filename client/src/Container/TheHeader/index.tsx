import React from "react";
import "./wishHeader.css";

import Logo from "../../Assets/xLogo.png";

//Icons
import { FiShoppingCart } from "react-icons/fi";
import { TbClipboardList } from "react-icons/tb";
import { FaUserGear } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <section className='appSection'>
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
            <FiShoppingCart
              className='wishIcon'
              style={{ fontSize: "1.8rem" }}
            />
          </div>
          <TbClipboardList className='wishIcon' />
          <FaUserGear className='wishIcon' />
        </div>
      </div>
    </section>
  );
};

export default Index;
