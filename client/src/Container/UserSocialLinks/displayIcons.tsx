import React, { useEffect, useState } from "react";
import "./UserSocials.css";

import { iCreatorSocialLinks } from "../../Types/creatorSocialLinksTypes";
import { useUserInfoCOntext } from "../../Context/UserProfileContextProvider";

import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const DisplayIcons = () => {
  const { creatorSocialLinks } = useUserInfoCOntext(); //Create a state for social links;
  const [displayedSocialLinks, setDisplayedSocialLinks] =
    useState(creatorSocialLinks);

  const handleDelete = (platform: string) => {
    const newLinks = creatorSocialLinks?.filter(
      (x: iCreatorSocialLinks) => x.platform_link !== platform
    );
    setDisplayedSocialLinks(newLinks || []);
  };

  useEffect(() => {
    setDisplayedSocialLinks(creatorSocialLinks || []);
  }, [creatorSocialLinks, setDisplayedSocialLinks]);

  return (
    <>
      {displayedSocialLinks?.map((x: iCreatorSocialLinks) => {
        return (
          <div key={x.platform_name} className='socialMediaLinkDiv'>
            <div>
              <img
                src={x.platform_icon}
                alt={`${x.platform_icon} Icon`}
                style={{ width: "28px", height: "28px" }}
              />
              <p className='platformNameDisplaying'>{x.platform_name}</p>
            </div>
            <div>
              <FiEdit className='editLinksIcons' />
              <MdDelete
                className='editLinksIcons'
                onClick={() => handleDelete(x.platform_name)}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default DisplayIcons;
