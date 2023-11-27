import React from 'react'
import "./UserSocials.css";

import { useUserInfoCOntext } from "../../Context/UserProfileContextProvider";
import { iCreatorSocialLinks } from "../../Types/creatorSocialLinksTypes";


import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const DisplayIcons = () => {
  const { creatorSocialLinks } = useUserInfoCOntext();

  return (
    <>
      {creatorSocialLinks?.map((link: iCreatorSocialLinks) => {
        return (
          <div key={link.platform} className='socialMediaLinkDiv'>
            <div>
              <img
                src={link.icon}
                alt={`${link.icon} Icon`}
                style={{ width: "28px", height: "28px" }}
              />
              <p className='platformNameDisplaying'>{link.platform}</p>
            </div>
            <div>
              <FiEdit className='editLinksIcons' />
              <MdDelete className='editLinksIcons' />
            </div>
          </div>
        );
      })}
    </>
  );
}

export default DisplayIcons