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
import { onGetSocialLinks } from "../../API/authApi";
import { useUserInfoCOntext } from "../../Context/UserProfileContextProvider";

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
  const { setRefetchIcons, refetchIcons } = useUserInfoCOntext(); //Create a state for social links;

  let userInfo = {
    profile_name: "Angela Smith",
    profile_photo: User,
    profile_bio: "Content Creator | Beauty, Fashion, Lifestyle.",
    profile_username: "@angela_smith",
  };

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

  return (
    <section className='profileSection'>
      <div className='coverImgDiv'>
        <img src={UserCover} alt='' className='userCover' />
      </div>
      <div className='userInfoDiv userInfoContainer'>
        {userInfo?.profile_name ? (
          <img src={userInfo.profile_photo} alt='' className='userImg' />
        ) : (
          <img src={UserAvatar} alt='' className='userImg' />
        )}
        <div className='userNameDiv'>
          <h3>Angela Smith</h3>
          <p>@angela_smith</p>
        </div>
        <p className='userBio'>Content Creator | Beauty, Fashion, Lifestyle.</p>
        {editInfo ? (
          <UserInfoEdit
            userImg={User}
            coverImg={UserCover}
            editInfo={editInfo}
            handleProfileInfoEdit={handleProfileInfoEdit}
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
