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
import Twitch from "../../Assets/UserIcons/Twitch.png";
import LoyalFans from "../../Assets/UserIcons/LoyalFans.png";
import Fansly from "../../Assets/UserIcons/Fansly.png";

//Icons
import { FiPlusSquare } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import { TbAdjustmentsHorizontal, TbEdit } from "react-icons/tb";
import { LiaUserEditSolid } from "react-icons/lia";

//Components
import TheWish from "../UpLoadWish/TheWish";
import UserInfoEdit from "./UserInfoEdit";

const Index = () => {
  const [uploadModule, setUploadModule] = useState(false);
  const [editInfo, setEditInfo] = useState(false);

  const handleCloseModule = () => {
    setUploadModule(!uploadModule);
  };

  const handleInfoEdit = () => {
    setEditInfo(!editInfo);
  };

  return (
    <section className='profileSection'>
      <div className='coverImgDiv'>
        <img src={UserCover} alt='' className='userCover' />
      </div>
      <div className='userInfoContainer'>
        <div className='userInfoDiv'>
          <img src={User} alt='' className='userImg' />
          <div className='userNameDiv'>
            <h3>Angela Smith</h3>
            <p>@angela_smith</p>
          </div>
          <p className='userBio'>
            Content Creator | Beauty, Fashion, Lifestyle.
          </p>
          {editInfo ? (
            <UserInfoEdit
              userImg={User}
              coverImg={UserCover}
              editInfo={editInfo}
              handleInfoEdit={handleInfoEdit}
            />
          ) : null}
          <div className='EditIconsDiv'>
            <button className='profileEdit' onClick={handleInfoEdit}>
              Edit your profile{" "}
              <LiaUserEditSolid style={{ fontSize: "1.3rem" }} />
            </button>
            <button className='editIconsBtn'>
              Add social links <TbEdit />
            </button>
          </div>
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
              <img src={Twitch} alt='' className='UserSocialIcons' />
              <p>Twitch</p>
            </div>
            <div>
              <img src={Tiktok} alt='' className='UserSocialIcons' />
              <p>Tiktok</p>
            </div>
            <div>
              <img src={ManyVids} alt='' className='UserSocialIcons' />
              <p>ManyVids</p>
            </div>
            <div>
              <img src={Fansly} alt='' className='UserSocialIcons' />
              <p>Fansluy</p>
            </div>
            <div>
              <img src={LoyalFans} alt='' className='UserSocialIcons' />
              <p>LoyalFans</p>
            </div>
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
            <TbAdjustmentsHorizontal className='orderbyIcon' />
          </div>
          <div className='rightBtns'>
            <button
              className='wishItemBtn'
              id='addWish'
              onClick={handleCloseModule}>
              Add wish
              <FiPlusSquare />
            </button>
          </div>
        </div>
        <div>
          {uploadModule ? (
            <UploadWish
              closeUploadModule={handleCloseModule}
              uploadModule={uploadModule}
            />
          ) : null}
        </div>
        <main className='theWishesSection'>
          <TheWish />
        </main>
      </div>
    </section>
  );
};

export default Index;
