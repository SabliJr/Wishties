import React, { useCallback, useEffect, useState, useRef } from "react";
import "./Profile.css";

import { MdClose } from "react-icons/md";
import { iUserInfo } from "../../Types/wishListTypes";
import { onUpdateCreatorInfo } from "../../API/authApi";

import ProfilePlus from "../../Assets/camera.png";
import CoverPlus from "../../Assets/Plus.png";

interface iImages {
  userImg: string;
  coverImg: string;
  editInfo: boolean;
  handleProfileInfoEdit: () => void;
  profileEditModal: boolean;
}

const UserInfoEdit = ({
  userImg,
  coverImg,
  handleProfileInfoEdit,
  editInfo,
  profileEditModal,
}: iImages) => {
  const [profileImgFile, setProfileImgFile] = useState<File | undefined>();
  const [coverImgFile, setCoverImgFile] = useState<File | undefined>();
  const [userProfileInfo, setUserProfileInfo] = useState<iUserInfo>(
    {} as iUserInfo
  );
  const modelRef = React.useRef<HTMLDivElement | null>(null);
  const coverImgRef = useRef<HTMLInputElement>(null);
  const profileImgRef = useRef<HTMLInputElement>(null);

  const closeEditPopup = () => {
    if (editInfo === true) {
      handleProfileInfoEdit();
    }
  };

  const handleCoverImgUpload = () => {
    coverImgRef?.current?.click();
  };

  const handleProfileImgUpload = () => {
    profileImgRef?.current?.click();
  };

  const handleImgUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    let imgFile: File | undefined = e.target?.files?.[0];

    if (field === "cover_photo") setCoverImgFile(imgFile);
    else if (field === "profile_photo") setProfileImgFile(imgFile);
  };

  const handleInfoInput = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    field: string
  ) => {
    let userInputs = e.target?.value;

    setUserProfileInfo((prev) => ({
      ...prev,
      cover_photo: coverImgFile,
      profile_photo: profileImgFile,
      [field]: userInputs,
    }));
  };

  // This function is to close the module of adding wish when the user clicks outside the module
  const closeModuleOutside = useCallback(
    (e: MouseEvent) => {
      if (modelRef?.current && !modelRef?.current?.contains(e.target as Node)) {
        handleProfileInfoEdit();
      }
    },
    [handleProfileInfoEdit]
  );

  useEffect(() => {
    document.addEventListener("mouseup", closeModuleOutside);
    return () => {
      document.removeEventListener("mouseup", closeModuleOutside);
    };
  }, [closeModuleOutside]);

  useEffect(() => {
    // Add the 'modal-open' class to the body when the modal is open
    if (
      profileEditModal &&
      !modelRef?.current?.contains(document.activeElement)
    ) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Clean up function
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [profileEditModal]);
  console.log(userProfileInfo);

  const handelSubmitData = async () => {
    const formData = new FormData();

    formData.append("profile_name", userProfileInfo.profile_name);
    formData.append("profile_username", userProfileInfo.profile_username);
    formData.append("profile_bio", userProfileInfo.profile_bio);
    if (userProfileInfo.profile_photo) {
      formData.append("profile_photo", userProfileInfo.profile_photo);
    }
    if (userProfileInfo.cover_photo) {
      formData.append("cover_photo", userProfileInfo.cover_photo);
    }

    try {
      const res = await onUpdateCreatorInfo(formData);
      console.log(res);
    } catch (err: any) {
      console.log(err);
    } finally {
      handleProfileInfoEdit();
    }
  };

  return (
    <>
      <div className='dorpBackModel'></div>
      <div className='editInfoSection' ref={modelRef}>
        <MdClose className='editProfileClose' onClick={closeEditPopup} />
        <h1>Edit your profile.</h1>
        <div className='coverImgEditDiv' onClick={handleCoverImgUpload}>
          <input
            type='file'
            name='image_uploads'
            accept='.jpg, .jpeg, .png, .webp'
            ref={coverImgRef}
            style={{ display: "none" }}
            onChange={(e) => handleImgUpload(e, "cover_photo")}
          />
          {coverImgFile ? (
            <img
              src={URL.createObjectURL(coverImgFile)}
              alt='coverImage'
              className='editCoverImg'
            />
          ) : (
            <img src={coverImg} alt='' className='editCoverImg' />
          )}
          <img src={CoverPlus} alt='CoverPlus' className='CoverPlus' />
        </div>
        <div className='LabelsDiv'>
          <div className='LabelsDiv1' onClick={handleProfileImgUpload}>
            {profileImgFile ? (
              <img
                src={URL.createObjectURL(profileImgFile)}
                alt='profileImage'
                className='editProfileImg'
              />
            ) : (
              <img src={userImg} alt='' className='editProfileImg' />
            )}
            <input
              type='file'
              name='image_uploads'
              accept='.jpg, .jpeg, .png, .webp'
              ref={profileImgRef}
              style={{ display: "none" }}
              onChange={(e) => handleImgUpload(e, "profile_photo")}
            />
            <img src={ProfilePlus} alt='ProfilePlus' className='ProfilePlus' />
          </div>
          <div className='LabelsDiv2'>
            <label htmlFor='yourName'>
              Name
              <input
                type='text'
                placeholder='Your name'
                id='yourName'
                onChange={(e) => handleInfoInput(e, "profile_name")}
              />
            </label>
            <label htmlFor=''>
              User Name
              <input
                type='text'
                placeholder='Your user Name'
                onChange={(e) => handleInfoInput(e, "profile_username")}
              />
            </label>
          </div>
        </div>
        <label className='userBioInput'>
          <p>
            Your Bio: <span>160 characters</span>
          </p>
          <textarea
            name='postContent'
            rows={4}
            cols={20}
            maxLength={160}
            wrap='soft'
            placeholder='Write your bio here...'
            onChange={(e) => handleInfoInput(e, "profile_bio")}
          />
        </label>{" "}
        <button className='updateProfileBtn' onClick={handelSubmitData}>
          Update Profile
        </button>
      </div>
    </>
  );
};

export default UserInfoEdit;
