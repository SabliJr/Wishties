import React, { useCallback, useEffect, useState } from "react";
import "./Profile.css";

import { MdClose } from "react-icons/md";
import { iUserInfo } from "../../Types/wishListTypes";

interface iImages {
  userImg: string;
  coverImg: string;
  editInfo: boolean;
  handleInfoEdit: () => void;
  profileEditModal: boolean;
}

const UserInfoEdit = ({
  userImg,
  coverImg,
  handleInfoEdit,
  editInfo,
  profileEditModal,
}: iImages) => {
  const [userProfileInfo, setUserProfileInfo] = useState<iUserInfo | undefined>(
    {}
  );
  const modelRef = React.useRef<HTMLDivElement | null>(null);

  const closeEditPopup = () => {
    if (editInfo === true) {
      handleInfoEdit();
    }
  };

  // This function is to close the module of adding wish when the user clicks outside the module
  const closeModuleOutside = useCallback(
    (e: MouseEvent) => {
      if (modelRef?.current && !modelRef?.current?.contains(e.target as Node)) {
        handleInfoEdit();
      }
    },
    [handleInfoEdit]
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

  return (
    <>
      <div className='dorpBackModel'></div>
      <div className='editInfoSection' ref={modelRef}>
        <MdClose className='editProfileClose' onClick={closeEditPopup} />
        <h1>Edit your info</h1>
        <div className='coverImgEditDiv'>
          {/* <img src={AnotherPhoto} alt='' className='editCoverImg' /> */}
        </div>
        <div className='LabelsDiv'>
          <div className='LabelsDiv1'>
            <img src={userImg} alt='' className='editUserImg' />
          </div>
          <div className='LabelsDiv2'>
            <label htmlFor='yourName'>
              Name
              <input type='text' placeholder='Your name' id='yourName' />
            </label>
            <label htmlFor=''>
              User Name
              <input type='text' placeholder='Your user Name' />
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
          />
        </label>{" "}
        <button className='updateProfileBtn'>Update Profile</button>
      </div>
    </>
  );
};

export default UserInfoEdit;
