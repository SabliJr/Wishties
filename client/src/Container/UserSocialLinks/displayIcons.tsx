import React, { useEffect } from "react";
import "./UserSocials.css";

import { iCreatorSocialLinks } from "../../Types/creatorStuffTypes";
import { useUserInfoCOntext } from "../../Context/UserProfileContextProvider";

import { MdDelete } from "react-icons/md";
import { onDeleteSocialLinks } from "../../API/authApi";

const DisplayIcons = () => {
  const [isError, setIsError] = React.useState("");
  const {
    creatorSocialLinks,
    displayedSocialLinks,
    setDisplayedSocialLinks,
    setCreatorSocialLinks,
    setRefetchIcons,
    refetchIcons,
  } = useUserInfoCOntext(); //Create a state for social links;

  const handleDelete = async (link_id: string) => {
    const newLinks = creatorSocialLinks?.filter(
      (x: iCreatorSocialLinks) => x.link_id !== link_id
    );

    try {
      setCreatorSocialLinks(newLinks || []);
      await onDeleteSocialLinks(link_id);
      setRefetchIcons(true);
    } catch (error) {
      if (error) {
        setIsError("Something went wrong deleting link, please try again!");
      }
    }
  };

  useEffect(() => {
    setDisplayedSocialLinks(creatorSocialLinks || []);
  }, [creatorSocialLinks, setDisplayedSocialLinks, refetchIcons]);

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
      {isError && <p className='error'>{isError}</p>}
    </>
  );
};

export default DisplayIcons;
