import React, { useState } from "react";
import "./Profile.css";

import UploadWish from "../UpLoadWish/index";

//User Images
import UserCover from "../../Assets/pexels-inga-seliverstova-3394779.jpg";
import User from "../../Assets/pexels-michelle-leman-6774998.jpg";

//User Links social media icons
import Insta from "../../Assets/UserIcons/instagram.png";
import Xtwitter from "../../Assets/UserIcons/xTwitter.png";
import OnlyFans from "../../Assets/UserIcons/OnlyFans.png";
import Tiktok from "../../Assets/UserIcons/Tiktok.png";
import ManyVids from "../../Assets/UserIcons/ManyVids.png";

//Icons
import { FiPlusSquare } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import { BsBorderStyle } from "react-icons/bs";

const Index = () => {
  const [upload, setUpload] = useState(false);

  return (
    <section className='profileSection'>
      <div className='coverImgDiv'>
        <img src={UserCover} alt='' className='userCover' />
      </div>
      <div className='userInfoDiv'>
        <img src={User} alt='' className='userImg' />
        <div className='userNameDiv'>
          <h3>Angela Smith</h3>
          <p>@angela_smith</p>
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
      </div>
      <div className='wishItemsDiv'>
        <div className='wishBtns'>
          <div className='leftBtns'>
            <button className='wishItemBtn'>
              Categories
              <IoMdArrowDropdown />
            </button>
            <BsBorderStyle className='orderbyIcon' />
          </div>
          <div>
            <button
              className='wishItemBtn'
              id='addWish'
              onClick={() => setUpload(!upload)}>
              Add wish
              <FiPlusSquare />
            </button>
          </div>
        </div>
        <div>{upload ? <UploadWish /> : null}</div>
      </div>
    </section>
  );
};

export default Index;
