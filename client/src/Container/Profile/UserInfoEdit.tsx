import React from "react";

import { MdClose } from "react-icons/md";

interface iImages {
  userImg: string;
  coverImg: string;
  editInfo: boolean;
  handleInfoEdit: () => void;
}

const UserInfoEdit = ({
  userImg,
  coverImg,
  handleInfoEdit,
  editInfo,
}: iImages) => {
  const closeEditPopup = () => {
    if (editInfo === true) {
      handleInfoEdit();
    }

    console.log(editInfo);
    console.log("You tried to close the module");
  };

  return (
    <div className='editInfoSection'>
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
  );
};

export default UserInfoEdit;
