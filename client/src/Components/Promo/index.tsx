import React from "react";
import "./promo.css";

import PromoImg from "../../Assets/6492b8667c8c4a9efe0f6f87_Wishlist_Screenshot.jpeg";
import { BiSolidBadgeCheck } from "react-icons/bi";

import Insta from "../../Assets/Insta.png";
import Youtube from "../../Assets/Youtube.png";
import Twitch from "../../Assets/twitch-logo-tv-png-7.png";
import Tiktok from "../../Assets/tiktok.png";
import OF from "../../Assets/OnlyFans_Logo_Full_Blue.svg.png";
import Fansly from "../../Assets/Fansly_logo.svg.png";

const Index = () => {
  return (
    <main className='promo'>
      <div className='textDiv'>
        <p>
          <BiSolidBadgeCheck /> Get early access
        </p>
        <p>
          <BiSolidBadgeCheck /> Your in safe hands
        </p>
        <p>
          <BiSolidBadgeCheck /> No hidden fees
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
