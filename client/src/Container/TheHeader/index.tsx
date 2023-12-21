import React from "react";
import "./wishHeader.css";

import Logo from "../../Assets/xLogo.png";

//Icons
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
          <TbClipboardList className='wishIcon' />
          <FaUserGear className='wishIcon' />
        </div>
      </div>
    </section>
  );
};

export default Index;
