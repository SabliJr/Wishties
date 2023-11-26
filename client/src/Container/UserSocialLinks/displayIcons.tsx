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
          <div key={link.platformName}>
            <div>
              <img
                src={link.icon}
                alt={`${link.icon} Icon`}
                style={{ width: "30px", height: "30px" }}
              />
              <p className='platformNameDisplaying'>{link.platformName}</p>
            </div>
            <div>
              <FiEdit />
              <MdDelete />
            </div>
          </div>
        );
      })}
    </>
  );
}

export default DisplayIcons