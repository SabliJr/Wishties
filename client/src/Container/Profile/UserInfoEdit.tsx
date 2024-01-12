import React, { useCallback, useEffect, useState, useRef } from "react";
import "./Profile.css";

import { MdClose } from "react-icons/md";
import { iUserInfo, iCreatorProfile } from "../../Types/wishListTypes";
import { onUpdateCreatorInfo, onIsUsernameAvailable } from "../../API/authApi";
import { debounce } from "lodash";

import ProfilePlus from "../../Assets/camera.png";
import CoverPlus from "../../Assets/Plus.png";

interface iImages {
  userInfo: iCreatorProfile | undefined;
  editInfo: boolean;
  handleProfileInfoEdit: () => void;
  profileEditModal: boolean;
  creator_cover_photo: string | undefined;
  creator_profile_photo: string | undefined;
}

const ALLOWED_EXTENSIONS = /(\.jpg|\.jpeg|\.png|\.webp)$/i;
const UserInfoEdit = ({
  handleProfileInfoEdit,
  userInfo,
  editInfo,
  profileEditModal,
  creator_cover_photo,
  creator_profile_photo,
}: iImages) => {
  const [profileImgFile, setProfileImgFile] = useState<File | undefined>();
  const [coverImgFile, setCoverImgFile] = useState<File | undefined>();
  const [isUsernameAvailable, setIsUsernameAvailable] =
    useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>(
    userInfo?.username as string
  );
  const [userProfileInfo, setUserProfileInfo] = useState<iUserInfo>({
    profile_name: userInfo?.creator_name,
    profile_username: userInfo?.username,
    profile_bio: userInfo?.creator_bio ? userInfo.creator_bio : "",
    profile_photo: undefined || userInfo?.profile_image,
    cover_photo: undefined || userInfo?.cover_image,
  } as iUserInfo);
  const [isError, setIsError] = useState({
    invalidFileTypeErr: "",
    usernameErr: "",
  });
  const modelRef = React.useRef<HTMLDivElement | null>(null);
  const coverImgRef = useRef<HTMLInputElement>(null);
  const profileImgRef = useRef<HTMLInputElement>(null);

  const closeEditPopup = () => {
    if (editInfo === true) {
      handleProfileInfoEdit();
    }
  };

  const handleImgUploads = (field: string) => {
    field === "cover_photo"
      ? coverImgRef?.current?.click()
      : profileImgRef?.current?.click();
  };

  // Handler for updating the state immediately as the user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value);
  };

  const handleUsernameChange = debounce(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const newUsername = e.target.value;

        if (newUsername.length > 0) {
          const response = await onIsUsernameAvailable(newUsername);

          if (response.data.isExists === false) {
            console.log(response.data);

            console.log("Username is available");
            setUserProfileInfo((prev) => ({
              ...prev,
              profile_username: newUsername,
            }));
          }
        }
      } catch (error: any) {
        if (error.response && error.response.data.isExists === true) {
          console.log(error.response.data);

          setIsUsernameAvailable(true);
          console.log("Username is not available");
          setIsError((prev) => ({
            ...prev,
            usernameErr: error.response.data.message,
          }));
        } else {
          // Handle other errors
          console.error(error);
        }
      }
    },
    2000
  );

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

  const handelSubmitData = async () => {
    const formData = new FormData();

    if (
      (userProfileInfo?.cover_photo instanceof File &&
        !ALLOWED_EXTENSIONS.exec(userProfileInfo?.cover_photo.name)) ||
      (userProfileInfo?.profile_photo instanceof File &&
        !ALLOWED_EXTENSIONS.exec(userProfileInfo?.profile_photo.name))
    ) {
      setIsError((prev) => ({
        ...prev,
        invalidFileTypeErr:
          "Please upload file having extensions .jpeg/.jpg/.png/.webp only.",
      }));

      return;
    }

    formData.append("profile_name", userProfileInfo.profile_name);
    formData.append("profile_username", userProfileInfo.profile_username);
    formData.append("profile_bio", userProfileInfo.profile_bio);
    if (
      userProfileInfo.profile_photo &&
      userProfileInfo.profile_photo !== userInfo?.profile_image
    ) {
      formData.append("profile_photo", userProfileInfo.profile_photo);
    }

    if (
      userProfileInfo.cover_photo &&
      userProfileInfo.cover_photo !== userInfo?.cover_image
    ) {
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
        <div
          className='coverImgEditDiv'
          onClick={() => handleImgUploads("cover_photo")}>
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
            <img src={creator_cover_photo} alt='' className='editCoverImg' />
          )}
          <img src={CoverPlus} alt='CoverPlus' className='CoverPlus' />
        </div>
        <div className='LabelsDiv'>
          <div
            className='LabelsDiv1'
            onClick={() => handleImgUploads("profile_image")}>
            {profileImgFile ? (
              <img
                src={URL.createObjectURL(profileImgFile)}
                alt='profileImage'
                className='editProfileImg'
              />
            ) : (
              <img
                src={creator_profile_photo}
                alt=''
                className='editProfileImg'
              />
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
                value={userProfileInfo?.profile_name}
                onChange={(e) => handleInfoInput(e, "profile_name")}
              />
            </label>
            <label htmlFor='yourUserName'>
              User Name
              <input
                type='text'
                id='yourUserName'
                placeholder='Your user Name'
                value={newUsername}
                onChange={(e) => {
                  handleInputChange(e);
                  handleUsernameChange(e);
                }}
              />
            </label>
            {isUsernameAvailable && userInfo?.username !== newUsername && (
              <p className='error'>{isError.usernameErr}</p>
            )}
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
            value={userProfileInfo?.profile_bio}
            wrap='soft'
            placeholder='Write your bio here...'
            onChange={(e) => handleInfoInput(e, "profile_bio")}
          />
        </label>{" "}
        {isError.invalidFileTypeErr && (
          <p className='error'>{isError.invalidFileTypeErr}</p>
        )}
        <button className='updateProfileBtn' onClick={handelSubmitData}>
          Update Profile
        </button>
      </div>
    </>
  );
};

export default UserInfoEdit;
