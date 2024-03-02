import React, { useState } from "react";
import "./Profile.css";

//User Images
import UserCover from "../../Assets/pexels-inga-seliverstova-3394779.jpg";
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
import CategoriesFilters from "../../utils/Filtering/CategoriesFilters";
import WishesFilters from "../../utils/Filtering/WishesFilters";
import SocialMediaLinkForm from "../UserSocialLinks/index"; //This is the user links component
import Errors from "../../Pages/Errors";

import {
  iCreatorSocialLinks,
  iCreatorDataProvider,
} from "../../Types/creatorStuffTypes";

import { useNavigate } from "react-router-dom";
import { useCreatorData } from "../../Context/CreatorDataProvider";

const Index = () => {
  const [uploadModule, setUploadModule] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [disable_bg, setDisable_bg] = useState(false);
  const [profileEditModal, setProfileEditModal] = useState(false); // This is the edit profile module
  const [editInfo, setEditInfo] = useState(false);
  const [socialLinksModule, setSocialLinksModule] = useState(false);

  let {
    creatorInfo,
    creatorSocialLinks,
    setDisplayCategories,
    setDisplayFilters,
    displayCategories,
    displayFilters,
    errLoadingWishes,
    getCategories,
    filteredAndSortedWishes,
  } = useCreatorData() as iCreatorDataProvider;
  let navigate = useNavigate();

  const handleCloseWishModule = () => {
    setUploadModule(!uploadModule);
    setModalOpen((prev) => !prev);
  };

  const handleProfileInfoEdit = () => {
    setEditInfo(!editInfo);
    setProfileEditModal((prev) => !prev);
  };

  const handleSocialLinksModule = () => {
    setSocialLinksModule((prev) => !prev);
    setDisable_bg((prev) => !prev);
  };

  let creator_cover_photo = creatorInfo?.cover_image
    ? creatorInfo.cover_image
    : UserCover;
  let creator_profile_photo = creatorInfo?.profile_image
    ? creatorInfo.profile_image
    : UserAvatar;
  let creator_bio = creatorInfo?.creator_bio
    ? creatorInfo.creator_bio
    : "No bio yet, say something to your fans!";

  const HandleFilteringCategories = () => {
    setDisplayCategories((prev: boolean) => !prev);
    setDisplayFilters(false);
  };

  const handleDisplayFilters = () => {
    setDisplayFilters((prev: boolean) => !prev);
    setDisplayCategories(false);
  };

  return (
    <>
      {errLoadingWishes ? (
        <Errors error={errLoadingWishes} />
      ) : (
        <section className='profileSection'>
          <div className='coverImgDiv'>
            <img src={creator_cover_photo} alt='' className='userCover' />
          </div>
          <div className='userInfoDiv userInfoContainer'>
            <img src={creator_profile_photo} alt='' className='userImg' />

            <div className='userNameDiv'>
              <h3>{creatorInfo?.creator_name}</h3>
              <p>@{creatorInfo?.username}</p>
            </div>
            <p className='userBio'>{creator_bio}</p>
            {editInfo ? (
              <UserInfoEdit
                editInfo={editInfo}
                creator_cover_photo={creator_cover_photo}
                creatorInfo={creatorInfo}
                handleProfileInfoEdit={handleProfileInfoEdit}
                creator_profile_photo={creator_profile_photo}
                profileEditModal={profileEditModal}
              />
            ) : null}
            <div className='EditIconsDiv'>
              <button className='profileEdit' onClick={handleProfileInfoEdit}>
                Edit your profile{" "}
                <LiaUserEditSolid style={{ fontSize: "1.3rem" }} />
              </button>
              {creatorInfo?.is_stripe_connected !== "ACTIVE" ? (
                <div className='_payment_setup_div'>
                  <p className='_payment_setup_p'>
                    Finish setting up your account to receive funds. You have
                    more steps to complete your payment setup.
                  </p>
                  <button
                    className='_payment_setup_btn'
                    onClick={() => navigate("/stripe-notice")}>
                    Finish Setting Up
                  </button>
                </div>
              ) : null}
              <button
                className='editIconsBtn'
                onClick={handleSocialLinksModule}>
                Add social links <TbEdit />
              </button>
            </div>
            {socialLinksModule ? (
              <SocialMediaLinkForm
                disable_bg={disable_bg}
                handleSocialLinksModule={handleSocialLinksModule}
              />
            ) : null}

            {/* Displaying the icons in the creator profile from the server */}
            <div className='userSocialLinks'>
              {(creatorSocialLinks as iCreatorSocialLinks[])?.length > 0 &&
                creatorSocialLinks?.map((x) => {
                  return (
                    <div
                      key={x.platform_name}
                      className='profileLinks'
                      onClick={() => {
                        window.open(`${x.platform_link}`, "_blank");
                      }}>
                      <img
                        src={x.platform_icon}
                        alt={`${x.platform_icon} Icon`}
                      />
                      <p>{x.platform_name}</p>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className='wishItemsDiv'>
            <div className='wishBtns'>
              <div className='leftBtns'>
                <button
                  className='wishItemBtn'
                  onClick={HandleFilteringCategories}>
                  Categories
                  <IoMdArrowDropdown />
                </button>
                <button onClick={handleDisplayFilters} className='_filters_btn'>
                  <TbAdjustmentsHorizontal className='orderbyIcon' />
                </button>
                {displayCategories ? (
                  <CategoriesFilters getCategories={getCategories} />
                ) : null}
                {displayFilters ? <WishesFilters /> : null}
              </div>
              <div className='rightBtns'>
                <button
                  className='wishItemBtn'
                  id='addWish'
                  onClick={handleCloseWishModule}>
                  Add wish
                  <FiPlusSquare />
                </button>
              </div>
            </div>
            {uploadModule ? (
              <UploadWish
                closeUploadModule={handleCloseWishModule}
                uploadModule={uploadModule}
                modalOpen={modalOpen}
              />
            ) : null}

            <main
              className={
                filteredAndSortedWishes.length > 0
                  ? "theWishesSection"
                  : "_add_wish_container"
              }>
              <TheWish />
            </main>
          </div>
        </section>
      )}
    </>
  );
};

export default Index;
