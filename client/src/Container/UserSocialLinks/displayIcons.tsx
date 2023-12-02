import React, {useEffect } from 'react'
import "./UserSocials.css";

import { useUserInfoCOntext } from "../../Context/UserProfileContextProvider";
import { iCreatorSocialLinks } from "../../Types/creatorSocialLinksTypes";


import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const DisplayIcons = () => {
  //This is an array of objects
  const { creatorSocialLinks, displayedSocialLinks, setDisplayedSocialLinks } =
    useUserInfoCOntext();

   const handleDelete = (platform: string) => {
     const newLinks = creatorSocialLinks?.filter(
       (x: iCreatorSocialLinks) => x.platform !== platform
     );
     setDisplayedSocialLinks(newLinks || []);
   };

   useEffect(() => {
     setDisplayedSocialLinks(creatorSocialLinks || []);
   }, [creatorSocialLinks, setDisplayedSocialLinks]);

  // const handleDelete = (platform: string) => {
  //   const newLinks = creatorSocialLinks?.filter((x: iCreatorSocialLinks) => x.platform !== platform);
  //   console.log(newLinks);
  //   return newLinks;
  // };

  return (
    <>
      {displayedSocialLinks?.map((x: iCreatorSocialLinks) => {
        return (
          <div key={x.platform} className='socialMediaLinkDiv'>
            <div>
              <img
                src={x.icon}
                alt={`${x.icon} Icon`}
                style={{ width: "28px", height: "28px" }}
              />
              <p className='platformNameDisplaying'>{x.platform}</p>
            </div>
            <div>
              <FiEdit className='editLinksIcons' />
              <MdDelete
                className='editLinksIcons'
                onClick={() => handleDelete(x.platform)}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

export default DisplayIcons
