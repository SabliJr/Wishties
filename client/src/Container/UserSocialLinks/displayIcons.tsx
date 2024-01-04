import React, { useEffect } from "react";
import "./UserSocials.css";

import { iCreatorSocialLinks } from "../../Types/creatorSocialLinksTypes";
import { useUserInfoCOntext } from "../../Context/UserProfileContextProvider";

import { MdDelete } from "react-icons/md";
import { onDeleteSocialLinks } from "../../API/authApi";

const DisplayIcons = () => {
  const {
    creatorSocialLinks,
    displayedSocialLinks,
    setDisplayedSocialLinks,
    setCreatorSocialLinks,
  } = useUserInfoCOntext(); //Create a state for social links;

  const handleDelete = async (link_id: string) => {
    const newLinks = creatorSocialLinks?.filter(
      (x: iCreatorSocialLinks) => x.link_id !== link_id
    );

    try {
      setCreatorSocialLinks(newLinks || []);
      const res = await onDeleteSocialLinks(link_id);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setDisplayedSocialLinks(creatorSocialLinks || []);
  }, [creatorSocialLinks, setDisplayedSocialLinks]);

  return (
    <>
      {displayedSocialLinks?.map((x: iCreatorSocialLinks) => {
        return (
          <div key={x.link_id} className='socialMediaLinkDiv'>
            <div>
              <img
                src={x.platform_icon}
                alt={`${x.platform_icon} Icon`}
                style={{ width: "28px", height: "28px" }}
              />
              <p className='platformNameDisplaying'>{x.platform_name}</p>
            </div>
            <div>
              <MdDelete
                className='editLinksIcons'
                onClick={() => handleDelete(x.link_id)}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default DisplayIcons;
