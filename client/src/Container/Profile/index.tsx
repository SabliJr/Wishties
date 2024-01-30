import React, { useEffect, useState, useContext } from "react";
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

import { iCreatorSocialLinks } from "../../Types/creatorStuffTypes";
import { iLocalUser } from "../../Types/creatorStuffTypes";

import { useLocation, useNavigate } from "react-router-dom";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues } from "../../Types/globalVariablesTypes";

const Index = () => {
  const [uploadModule, setUploadModule] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [disable_bg, setDisable_bg] = useState(false);
  const [profileEditModal, setProfileEditModal] = useState(false); // This is the edit profile module
  const [editInfo, setEditInfo] = useState(false);
  const [socialLinksModule, setSocialLinksModule] = useState(false);
  const [user_info, setUser_info] = useState<iLocalUser | null>({
    creator_id: "",
    username: "",
    role: "",
  });
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const {
    creatorInfo,
    creatorSocialLinks,
    displayFilters,
    setDisplayFilters,
    displayCategories,
    setDisplayCategories,
    getCategories,
    showProfile,
    // setRefetchCreatorData,
  } = contextValues as iGlobalValues;

  let { pathname } = useLocation();
  let navigate = useNavigate();

  useEffect(() => {
    let role = localStorage.getItem("user_info");
    // setRefetchCreatorData(true);
    if (role) setUser_info(JSON.parse(role));
    else setUser_info(null);
  }, [pathname]);
  // console.log(pathname);

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
    setDisplayCategories(!displayCategories);
    setDisplayFilters(false);
  };

  return (
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
        {user_info?.role === "creator" && !showProfile ? (
          <div className='EditIconsDiv'>
            <button className='profileEdit' onClick={handleProfileInfoEdit}>
              Edit your profile{" "}
              <LiaUserEditSolid style={{ fontSize: "1.3rem" }} />
            </button>
            <div className='_payment_setup_div'>
              <p className='_payment_setup_p'>
                Finish setting up your account to receive funds. You have more
                steps to complete your payment setup.
              </p>
              <button
                className='_payment_setup_btn'
                onClick={() => navigate("/stripe-notice", { replace: true })}>
                Finish Setting Up
              </button>
            </div>
            <button className='editIconsBtn' onClick={handleSocialLinksModule}>
              Add social links <TbEdit />
            </button>
          </div>
        ) : null}
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
            <button className='wishItemBtn' onClick={HandleFilteringCategories}>
              Categories
              <IoMdArrowDropdown />
            </button>
            <TbAdjustmentsHorizontal
              className='orderbyIcon'
              onClick={() => {
                setDisplayFilters(!displayFilters);
                setDisplayCategories(false);
              }}
            />
            {displayCategories && (
              <CategoriesFilters getCategories={getCategories} />
            )}
            {displayFilters && <WishesFilters />}
          </div>
          {user_info?.role === "creator" && !showProfile ? (
            <div className='rightBtns'>
              <button
                className='wishItemBtn'
                id='addWish'
                onClick={handleCloseWishModule}>
                Add wish
                <FiPlusSquare />
              </button>
            </div>
          ) : (
            <div className='rightBtns'>
              <button className='surprise_btn'>
                <span>
                  <svg
                    id='SurpriseIcon_222_16960'
                    focusable='false'
                    aria-hidden='true'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                    width='25'
                    height='25'
                    fill='none'>
                    <g clipPath='url(#clip0_222_16960)'>
                      <path
                        d='M9.38737 11.9832C10.3078 11.9832 11.054 11.237 11.054 10.3166C11.054 9.39609 10.3078 8.6499 9.38737 8.6499C8.4669 8.6499 7.7207 9.39609 7.7207 10.3166C7.7207 11.237 8.4669 11.9832 9.38737 11.9832Z'
                        fill='currentColor'></path>
                      <path
                        d='M17.062 12.4166C16.7537 12.4166 16.462 12.3166 16.2204 12.1416C16.162 12.0999 16.1037 12.0499 16.0537 12.0082C15.9037 11.8582 15.7787 11.6749 15.6954 11.4666L15.6037 11.1749C13.512 11.3999 11.887 13.1666 11.887 15.3166H6.88704C6.88704 13.0166 5.02038 11.1499 2.72038 11.1499V9.48324C5.02038 9.48324 6.88704 7.6249 6.88704 5.31657H9.65371V5.28324C9.65371 4.94157 9.76204 4.61657 9.95371 4.34157C10.1454 4.0749 10.412 3.86657 10.737 3.75824L11.0704 3.6499H5.85371C5.17871 3.6499 4.62871 3.6499 4.17871 3.69157C3.71204 3.7249 3.27871 3.80824 2.87038 4.01657C2.24538 4.33324 1.73704 4.8499 1.42038 5.4749C1.21204 5.8749 1.12871 6.30824 1.08704 6.7749C1.05371 7.2249 1.05371 7.78324 1.05371 8.4499V12.1832C1.05371 12.8582 1.05371 13.4082 1.08704 13.8666C1.12871 14.3332 1.21204 14.7582 1.42038 15.1666C1.73704 15.7916 2.24538 16.2999 2.87038 16.6249C3.27871 16.8249 3.71204 16.9082 4.17871 16.9499C4.62871 16.9832 5.17871 16.9832 5.85371 16.9832H12.9204C13.5954 16.9832 14.1454 16.9832 14.5954 16.9499C15.062 16.9082 15.4954 16.8249 15.9037 16.6249C16.5287 16.2999 17.037 15.7916 17.3537 15.1666C17.562 14.7582 17.6454 14.3332 17.687 13.8666C17.7204 13.4249 17.7204 12.8999 17.7204 12.2582C17.7037 12.2666 17.6787 12.2749 17.662 12.2832C17.4704 12.3749 17.2704 12.4166 17.062 12.4166ZM2.75371 6.90824C2.77871 6.5499 2.83704 6.35824 2.90371 6.23324C3.06204 5.91657 3.32038 5.65824 3.62871 5.4999C3.76204 5.43324 3.94538 5.38324 4.31204 5.3499C4.55371 5.3249 4.84538 5.31657 5.22038 5.3249C5.21204 6.6999 4.10371 7.80824 2.72871 7.81657C2.72038 7.4499 2.72871 7.1499 2.75371 6.90824ZM4.31204 15.2916C3.94538 15.2582 3.76204 15.2082 3.62871 15.1416C3.32038 14.9749 3.06204 14.7249 2.90371 14.4082C2.83704 14.2832 2.77871 14.0916 2.75371 13.7249C2.72871 13.4832 2.72038 13.1916 2.72871 12.8166C4.10371 12.8249 5.21204 13.9416 5.22038 15.3082C4.84538 15.3166 4.55371 15.3082 4.31204 15.2916ZM16.0204 13.7249C15.9954 14.0916 15.937 14.2832 15.8704 14.4082C15.712 14.7249 15.4537 14.9749 15.1454 15.1416C15.012 15.2082 14.8287 15.2582 14.462 15.2916C14.2204 15.3082 13.9287 15.3166 13.5537 15.3082C13.562 13.9416 14.6704 12.8249 16.0454 12.8166C16.0537 13.1916 16.0454 13.4832 16.0204 13.7249Z'
                        fill='currentColor'></path>
                      <path
                        d='M18.8704 9.24131C18.8204 9.17464 18.7537 9.11631 18.6537 9.09131L18.1454 8.92464C18.0204 8.88298 17.9037 8.80798 17.812 8.71631C17.7204 8.62464 17.6454 8.50797 17.6037 8.38297L17.437 7.86631C17.412 7.78298 17.3537 7.71631 17.287 7.66631C17.1454 7.56631 16.9537 7.56631 16.812 7.66631C16.7454 7.71631 16.687 7.78298 16.662 7.86631L16.4954 8.38297C16.4537 8.50797 16.387 8.62464 16.2954 8.71631C16.2037 8.80798 16.087 8.88298 15.9704 8.92464L15.4537 9.09131C15.3704 9.11631 15.3037 9.17464 15.2537 9.24131C15.2037 9.30797 15.1787 9.39131 15.1787 9.48297C15.1787 9.57464 15.2037 9.64964 15.2537 9.72464C15.3037 9.79131 15.3704 9.84964 15.4537 9.87464L15.9704 10.0413C16.0954 10.083 16.212 10.158 16.3037 10.2496C16.3954 10.3413 16.4704 10.458 16.512 10.583L16.6787 11.108C16.712 11.1913 16.762 11.258 16.8287 11.2996C16.8954 11.3496 16.9787 11.3746 17.0704 11.3746C17.162 11.3746 17.237 11.3496 17.3037 11.2996C17.3704 11.2496 17.4287 11.183 17.4537 11.0996L17.6204 10.5913C17.662 10.4663 17.7287 10.3496 17.8287 10.258C17.9204 10.1663 18.037 10.0913 18.162 10.0496L18.6787 9.88298C18.762 9.85798 18.8287 9.79964 18.8787 9.73297C18.9287 9.66631 18.9537 9.58297 18.9537 9.49131C18.9537 9.39964 18.9287 9.32464 18.8787 9.24964L18.8704 9.24131Z'
                        fill='currentColor'></path>
                      <path
                        d='M10.8036 4.94147C10.737 5.04147 10.6953 5.15814 10.6953 5.2748C10.6953 5.39147 10.7286 5.50814 10.8036 5.60814C10.8703 5.70814 10.9703 5.78314 11.087 5.8248L12.0286 6.13314C12.287 6.21647 12.5203 6.36647 12.7036 6.5498C12.8953 6.74147 13.037 6.9748 13.1203 7.23314L13.4286 8.18314C13.4703 8.2998 13.5453 8.39147 13.637 8.46647C13.737 8.53314 13.8536 8.5748 13.9703 8.5748C14.087 8.5748 14.212 8.54147 14.3036 8.46647C14.4036 8.3998 14.4703 8.2998 14.512 8.18314L14.8203 7.24147C14.9036 6.99147 15.0536 6.7498 15.237 6.56647C15.4286 6.3748 15.662 6.23314 15.912 6.1498L16.862 5.84147C16.9786 5.7998 17.0786 5.7248 17.1453 5.63314C17.212 5.53314 17.2536 5.41647 17.2536 5.2998C17.2536 5.18314 17.2203 5.05814 17.1453 4.96647C17.0786 4.86647 16.9786 4.79147 16.837 4.7498L15.8953 4.44147C15.637 4.35814 15.4036 4.20814 15.212 4.0248C15.0203 3.83314 14.8786 3.5998 14.7953 3.3498L14.487 2.40814C14.4453 2.29147 14.3786 2.1998 14.2786 2.1248C14.087 1.98314 13.8036 1.98314 13.6036 2.1248C13.5036 2.19147 13.4286 2.29147 13.3953 2.40814L13.0786 3.36647C12.9953 3.61647 12.8536 3.84147 12.662 4.0248C12.4786 4.20814 12.2453 4.3498 12.0036 4.44147L11.0536 4.7498C10.937 4.79147 10.837 4.86647 10.7703 4.95814L10.8036 4.94147Z'
                        fill='currentColor'></path>
                    </g>
                    <defs>
                      <clipPath id='clip0_222_16960'>
                        <rect
                          width='17.8917'
                          height='14.9833'
                          fill='currentColor'
                          transform='translate(1.05371 2)'></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                Send Surprise
              </button>
            </div>
          )}
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
