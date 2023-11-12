import React, { useState } from "react";
import "./Profile.css";

//User Images
import UserCover from "../../Assets/pexels-inga-seliverstova-3394779.jpg";
import User from "../../Assets/pexels-michelle-leman-6774998.jpg";
import UserAvatar from "../../Assets/UserAvatar.png";

//Icons
import { FiPlusSquare } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import { TbAdjustmentsHorizontal, TbEdit } from "react-icons/tb";
import { LiaUserEditSolid } from "react-icons/lia";

//Components
import TheWish from "../UpLoadWish/TheWish";
import UserInfoEdit from "./UserInfoEdit";
import UploadWish from "../UpLoadWish/index";
import { useUserInfoCOntext } from "../../Context/UserProfileContextProvider";
import SocialMediaLinkForm from "../UserSocialLinks/index";

const Index = () => {
  const [uploadModule, setUploadModule] = useState(false);
  const [editInfo, setEditInfo] = useState(false);
  const { userInfo } = useUserInfoCOntext();

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
          {userInfo?.profileName ? (
            <img src={userInfo.profilePhoto} alt='' className='userImg' />
          ) : (
            <img src={UserAvatar} alt='' className='userImg' />
          )}
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
            <SocialMediaLinkForm />
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
