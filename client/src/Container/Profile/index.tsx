import React, { useEffect, useState } from "react";
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
import { iCreatorSocialLinks } from "../../Types/creatorSocialLinksTypes";
import SocialMediaLinkForm from "../UserSocialLinks/index"; //This is the user links component
import { onGetSocialLinks, onGetCreator } from "../../API/authApi";
import { useUserInfoCOntext } from "../../Context/UserProfileContextProvider";
import { iCreatorProfile } from "../../Types/wishListTypes";

const Index = () => {
  const [uploadModule, setUploadModule] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [disable_bg, setDisable_bg] = useState(false);
  const [profileEditModal, setProfileEditModal] = useState(false); // This is the edit profile module
  const [editInfo, setEditInfo] = useState(false);
  const [socialLinksModule, setSocialLinksModule] = useState(false);
  const [getCreatorSocialLinks, setGetCreatorSocialLinks] = useState<
    iCreatorSocialLinks[]
  >([]);
  const [userInfo, setUserInfo] = useState<iCreatorProfile | undefined>(); //Create a state for social links;
  const { setRefetchIcons, refetchIcons } = useUserInfoCOntext(); //Create a state for social links;

  useEffect(() => {
    (async () => {
      try {
        const res = await onGetCreator();
        setUserInfo(res.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await onGetSocialLinks();
        setGetCreatorSocialLinks(res.data);
      } catch (error) {
        console.log(error);
      }
    })();

    setRefetchIcons(false);
  }, [setRefetchIcons, refetchIcons]);

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

  let creator_cover_photo = userInfo?.cover_image
    ? userInfo.cover_image
    : UserCover;
  let creator_profile_photo = userInfo?.profile_image
    ? userInfo.profile_image
    : UserAvatar;
  let creator_bio = userInfo?.creator_bio
    ? userInfo.creator_bio
    : "No bio yet, say something to your fans!";

  return (
    <section className='profileSection'>
      <div className='coverImgDiv'>
        <img src={creator_cover_photo} alt='' className='userCover' />
      </div>
      <div className='userInfoDiv userInfoContainer'>
        <img src={creator_profile_photo} alt='' className='userImg' />

        <div className='userNameDiv'>
          <h3>{userInfo?.creator_name}</h3>
          <p>{userInfo?.username}</p>
        </div>
        <p className='userBio'>{creator_bio}</p>
        {editInfo ? (
          <UserInfoEdit
            editInfo={editInfo}
            creator_cover_photo={creator_cover_photo}
            userInfo={userInfo}
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
          <button className='editIconsBtn' onClick={handleSocialLinksModule}>
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
          {(getCreatorSocialLinks as iCreatorSocialLinks[])?.length > 0 &&
            getCreatorSocialLinks?.map((x) => {
              return (
                <div
                  key={x.platform_name}
                  className='profileLinks'
                  onClick={() => {
                    window.open(`${x.platform_link}`, "_blank");
                  }}>
                  <img src={x.platform_icon} alt={`${x.platform_icon} Icon`} />
                  <p>{x.platform_name}</p>
                </div>
              );
            })}
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
        <main className='theWishesSection'>
          <TheWish />
        </main>
      </div>
    </section>
  );
};

export default Index;
