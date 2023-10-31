import React from "react";
import "./Profile.css";

import UserCover from "../../Assets/pexels-inga-seliverstova-3394779.jpg";
import User from "../../Assets/pexels-michelle-leman-6774998.jpg";

import Insta from "../../Assets/UserIcons/instagram.png";
import Xtwitter from "../../Assets/UserIcons/xTwitter.png";
import OnlyFans from "../../Assets/UserIcons/OnlyFans.png";
import Tiktok from "../../Assets/UserIcons/Tiktok.png";
import ManyVids from "../../Assets/UserIcons/ManyVids.png";

const Index = () => {
  return (
    <div className='profileDiv'>
      <img src={UserCover} alt='' className='userCover' />
      <section className='userSection'>
        <div className='userImgDiv'>
          <img src={User} alt='' className='userImg' />
          <div className='userNameDiv'>
            <h3>Angela Smith</h3>
            <p>@angela_smith</p>
          </div>
        </div>
        <p className='userBio'>Content Creator | Beauty, Fashion, Lifestyle.</p>
        <div className='userSocialDiv'>
          <div>
            <img src={Insta} alt='' className='UserSocialIcons' />
            <p>Instagram</p>
          </div>
          <div>
            <img src={OnlyFans} alt='' className='UserSocialIcons' />
            <p>OnlyFans</p>
          </div>
          <div>
            <img src={Xtwitter} alt='' className='UserSocialIcons' />
            <p>Twitter</p>
          </div>
          <div>
            <img src={Tiktok} alt='' className='UserSocialIcons' />
            <p>Tiktok</p>
          </div>
          <div>
            <img src={ManyVids} alt='' className='UserSocialIcons' />
            <p>ManyVids</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
