import React from "react";
import "./Features.css";

import ProfileCus from "../../Assets/64918beebe71c59abe07a456_Profile_Links-p-500.png";
import ThankImg from "../../Assets/6483444c1b63be0f50222d14_Message-GIF.gif";
import wishListIcon from "../../Assets/list2.png";
import { SiBiolink } from "react-icons/si";

const Index = () => {
  return (
    <main className='mainGrid'>
      <article className='LogoArt'>
        <h3>
          Why to <span>join</span> WishLinks
        </h3>
      </article>
      <article className='wishListArt'>
        <div className='iWishDiv'>
          <img src={wishListIcon} alt='wishListIcon' className='wishListIcon' />
          <SiBiolink className='iWish' />
        </div>
        <div>
          <h4>
            <span>One Stop</span>
            <br /> Wishlist & Bio Link
          </h4>
          <p>
            Create custom cash funds for college, travel, and all your links in
            one place.
          </p>
        </div>
      </article>
      <article className='cashArt'>
        <div className='cashAndSup'>💸</div>
        <div className='cashText'>
          <h4>
            <span>Cash</span> Gifts
          </h4>
          <p>Add cash gifts and receive them as payouts</p>
        </div>
      </article>
      <article className='profileArt'>
        <div>
          <h4>
            <span>Profile</span>
            <br /> Customization
          </h4>
          <p>
            Customise your profile to match your style and show all your links
            on your profile.
          </p>
        </div>
        <img src={ProfileCus} alt='profileCus' className='profileCus' />
      </article>
      <article className='thankArt'>
        <div>
          <h4>
            <span>Thank</span>
            <br /> Messages
          </h4>
          <p>
            Receive messages with your gifts and thank your fans with a personal
            message!
          </p>
        </div>
        <img src={ThankImg} alt='ThankImg' className='thankImg' />
      </article>
      <article className='supArt'>
        <div className='cashAndSup'>🎉</div>
        <div>
          <h4>
            <span>Surprise</span> Gifts
          </h4>
          <p>
            Let your fans send you any gift they want from the categories you
            choose.
          </p>
        </div>
      </article>
    </main>
  );
};

export default Index;
