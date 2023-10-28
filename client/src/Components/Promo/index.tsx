import React from "react";
import "./promo.css";

import PromoImg from "../../Assets/Wishties_design/Wishties_desk.png";

import Insta from "../../Assets/Insta.png";
import Youtube from "../../Assets/Youtube.png";
import Twitch from "../../Assets/twitch-logo-tv-png-7.png";
import Tiktok from "../../Assets/tiktok.png";
import OF from "../../Assets/OnlyFans_Logo_Full_Blue.svg.png";
import Fansly from "../../Assets/Fansly_logo.svg.png";

import { HiBadgeCheck } from "react-icons/hi";

const Index = () => {
  return (
    <main className='promo'>
      <div className='textDiv'>
        <p>
          <HiBadgeCheck className='checkIcon' />
          &nbsp; For All Creators
        </p>
        <p>
          <HiBadgeCheck className='checkIcon' />
          &nbsp; Privacy First
        </p>
        <p>
          <HiBadgeCheck className='checkIcon' />
          &nbsp; It's free
        </p>
      </div>
      <img src={PromoImg} alt='promImg' className='promImg' />
      <div className='cumLogos'>
        <h5>
          BUILT FOR CREATORS OF ALL PLATFORMS, <span> non-judgmental.</span>
        </h5>
        <div>
          <img src={Insta} alt='' />
          <img src={OF} alt='' />
          <img src={Tiktok} alt='' />
          <img src={Youtube} alt='' />
          <img src={Fansly} alt='' />
          <img src={Twitch} alt='' />
        </div>
      </div>
    </main>
  );
};

export default Index;
