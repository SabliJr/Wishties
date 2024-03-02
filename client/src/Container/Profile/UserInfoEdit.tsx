import React, { useEffect, useState, useRef } from "react";
import "./Profile.css";

import { MdClose } from "react-icons/md";
import {
  iCreatorProfile,
  iUserInfo,
  iCreatorDataProvider,
} from "../../Types/creatorStuffTypes";
import { onUpdateCreatorInfo, onIsUsernameAvailable } from "../../API/authApi";
import { debounce } from "lodash";

import ProfilePlus from "../../Assets/camera.png";
import CoverPlus from "../../Assets/Plus.png";
import Loader from "../../utils/Loader";
import CloseModules from "../../utils/CloseModules";

import { useCreatorData } from "../../Context/CreatorDataProvider";

interface iImages {
  creatorInfo: iCreatorProfile | undefined;
  editInfo: boolean;
  handleProfileInfoEdit: () => void;
  profileEditModal: boolean;
  creator_cover_photo: string | undefined;
  creator_profile_photo: string | undefined;
}

const ALLOWED_EXTENSIONS = /(\.jpg|\.jpeg|\.png|\.webp)$/i;
const UserInfoEdit = ({
  handleProfileInfoEdit,
  creatorInfo,
  editInfo,
  profileEditModal,
  creator_cover_photo,
  creator_profile_photo,
}: iImages) => {
  const [profileImgFile, setProfileImgFile] = useState<File | undefined>();
  const [coverImgFile, setCoverImgFile] = useState<File | undefined>();
  const [remainsChars, setRemainsChars] = useState<number>(150);
  const [newUsername, setNewUsername] = useState<string>(
    creatorInfo?.username as string
  );

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [userProfileInfo, setUserProfileInfo] = useState<iUserInfo>({
    profile_name: creatorInfo?.creator_name,
    profile_username: creatorInfo?.username,
    profile_bio: creatorInfo?.creator_bio ? creatorInfo.creator_bio : "",
    profile_photo: undefined || creatorInfo?.profile_image,
    cover_photo: undefined || creatorInfo?.cover_image,
  } as iUserInfo);

  const [isError, setIsError] = useState("");
  const [usernameErr, setUsernameErr] = useState<string>("");

  const modelRef = React.useRef<HTMLDivElement | null>(null);
  const coverImgRef = useRef<HTMLInputElement>(null);
  const profileImgRef = useRef<HTMLInputElement>(null);

  let { setRefreshCreatorData } = useCreatorData() as iCreatorDataProvider;

  const closeEditPopup = () => {
    if (editInfo === true) {
      handleProfileInfoEdit();
    }
  };

  // This is called whenever a user has made changes to the data
  const handleDataChange = () => {
    setHasChanges(true);
  };

  const handleImgUploads = (field: string) => {
    return field === "cover_photo"
      ? coverImgRef?.current?.click()
      : field === "profile_image"
      ? profileImgRef?.current?.click()
      : null;
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
            setUserProfileInfo((prev) => ({
              ...prev,
              profile_username: newUsername,
            }));
          }
        }
      } catch (error: any) {
        if (error.response && error.response.data.isExists === true) {
          setUsernameErr(error.response.data.message);
        } else {
          // Handle other errors
          alert(error.response.data.message);
        }
      } finally {
        handleDataChange();
      }
    },
    2000
  );

  const handleImgUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    let imgFile: File | undefined = e.target?.files?.[0];
    handleDataChange();

    if (field === "cover_photo") {
      setCoverImgFile(imgFile);
      setUserProfileInfo((prev) => ({
        ...prev,
        cover_photo: imgFile as File,
      }));
    } else if (field === "profile_photo") {
      setProfileImgFile(imgFile);
      setUserProfileInfo((prev) => ({
        ...prev,
        profile_photo: imgFile as File,
      }));
    }
  };

  const handleInfoInput = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    field: string
  ) => {
    let userInputs = e.target?.value;
    handleDataChange();
    if (field === "profile_bio") {
      setRemainsChars(150 - userInputs.length);
    }

    setUserProfileInfo((prev) => ({
      ...prev,
      [field]: userInputs,
    }));
  };

  // This function is to close the module of adding wish when the user clicks outside the module
  CloseModules({
    module_ref: modelRef,
    ft_close_module: handleProfileInfoEdit,
  });

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
    handleDataChange();
    const formData = new FormData();

    if (
      (userProfileInfo?.cover_photo instanceof File &&
        !ALLOWED_EXTENSIONS.exec(userProfileInfo?.cover_photo.name)) ||
      (userProfileInfo?.profile_photo instanceof File &&
        !ALLOWED_EXTENSIONS.exec(userProfileInfo?.profile_photo.name))
    ) {
      setIsError(
        "Please upload file having extensions .jpeg/.jpg/.png/.webp only."
      );

      return;
    }

    formData.append("profile_name", userProfileInfo.profile_name);
    formData.append("profile_username", userProfileInfo.profile_username);
    formData.append("profile_bio", userProfileInfo.profile_bio);
    if (
      userProfileInfo.profile_photo &&
      userProfileInfo.profile_photo !== creatorInfo?.profile_image
    ) {
      formData.append("profile_photo", userProfileInfo.profile_photo);
    }

    if (
      userProfileInfo.cover_photo &&
      userProfileInfo.cover_photo !== creatorInfo?.cover_image
    ) {
      formData.append("cover_photo", userProfileInfo.cover_photo);
    }
    setIsLoading(true);

    try {
      await onUpdateCreatorInfo(formData);
      handleProfileInfoEdit();
      setRefreshCreatorData(true);
    } catch (err: any) {
      if (err) {
        if (err.response?.status === 405) {
          setUsernameErr(err.response.data.message);
        } else setIsError(err.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='dorpBackModel'></div>
      <div className='editInfoSection' ref={modelRef}>
        {isLoading && <Loader />}
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
                onChange={(e) => {
                  handleInfoInput(e, "profile_name");
                  handleDataChange();
                }}
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
              {usernameErr && <p className='_userNameErr'>{usernameErr}</p>}
            </label>
          </div>
        </div>
        <label className='userBioInput'>
          <p>
            Your Bio: <span>Max 150 characters, remaining {remainsChars}</span>
          </p>
          <textarea
            name='postContent'
            rows={4}
            cols={20}
            maxLength={150}
            value={userProfileInfo?.profile_bio}
            wrap='soft'
            placeholder='Write your bio here...'
            onChange={(e) => handleInfoInput(e, "profile_bio")}
          />
          {isError && <p id='_invalidError'>{isError}</p>}
        </label>{" "}
        <button
          className='updateProfileBtn'
          onClick={handelSubmitData}
          disabled={isLoading || !hasChanges}>
          Update Profile
        </button>
      </div>
    </>
  );
};

export default UserInfoEdit;
