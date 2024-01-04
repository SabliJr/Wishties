import React, { useState } from "react";

import { iCreatorSocialLinks } from "../../Types/creatorSocialLinksTypes";
import { useUserInfoCOntext } from "../../Context/UserProfileContextProvider";
import { v4 as uuidv4 } from "uuid";

import Insta from "../../Assets/UserIcons/instagram.png";
import xTwitter from "../../Assets/UserIcons/xT.png";
import OnlyFans from "../../Assets/UserIcons/OnlyFans.png";
import Tiktok from "../../Assets/UserIcons/Tiktok.png";
import ManyVids from "../../Assets/UserIcons/ManyVids.png";
import Twitch from "../../Assets/UserIcons/nTwitch.png";
import LoyalFans from "../../Assets/UserIcons/LoyalFans.png";
import Fansly from "../../Assets/UserIcons/Fansly.png";
import Reddit from "../../Assets/UserIcons/Reddit.png";
import Discord from "../../Assets/UserIcons/Discord.png";
import Other from "../../Assets/UserIcons/Link.png";

type SelectPlatformProps = {
  setLinksModule: (value: boolean) => void;
  linksModule: boolean;
};

const SelectPlatform = ({
  setLinksModule,
  linksModule,
}: SelectPlatformProps) => {
  const [errMessage, setErrMessage] = useState("");
  const [fillingSocialInfo, setFillingSocialInfo] =
    useState<iCreatorSocialLinks>({
      link_id: "",
      platform_icon: "",
      platform_name: "",
      platform_link: "",
    });

  const { setCreatorSocialLinks } = useUserInfoCOntext();

  const socialMediaOptions = [
    { platform_icon: Insta, platform_name: "Instagram" },
    { platform_icon: xTwitter, platform_name: "Twitter" },
    { platform_icon: Tiktok, platform_name: "Tiktok" },
    { platform_icon: OnlyFans, platform_name: "OnlyFans" },
    { platform_icon: ManyVids, platform_name: "ManyVids" },
    { platform_icon: Twitch, platform_name: "Twitch" },
    { platform_icon: LoyalFans, platform_name: "LoyalFans" },
    { platform_icon: Fansly, platform_name: "Fansly" },
    { platform_icon: Reddit, platform_name: "Reddit" },
    { platform_icon: Discord, platform_name: "Discord" },
    { platform_icon: Other, platform_name: "Other" },
  ];

  const handleLinkChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    const value = event?.target?.value;

    if (field === "platform_name") {
      const selectedPlatform = socialMediaOptions.find(
        (option) => option.platform_name === value
      );

      if (selectedPlatform) {
        setFillingSocialInfo((prevInfo) => ({
          ...prevInfo,
          [field]: value,
          platform_icon: selectedPlatform.platform_icon,
          link_id: uuidv4(),
        }));
      }
    } else {
      setFillingSocialInfo((prevInfo) => ({
        ...prevInfo,
        [field]: value,
        link_id: uuidv4(),
      }));
    }
  };

  const handleAddLinks = () => {
    if (!fillingSocialInfo.platform_name || !fillingSocialInfo.platform_link) {
      setErrMessage("Please fill in all fields");
      return;
    }
    setErrMessage("");
    console.log(fillingSocialInfo);
    setCreatorSocialLinks((prevLinks) => [
      ...prevLinks,
      fillingSocialInfo as iCreatorSocialLinks,
    ]);
    setLinksModule(!linksModule); // Close the module
  };

  return (
    <>
      <select
        onChange={(e) => handleLinkChange(e, "platform_name")}
        className='platformsSelection'>
        <option value=''>Select Platform</option>
        {socialMediaOptions.map((option) => (
          <option key={option.platform_name} value={option.platform_name}>
            {option.platform_name}
          </option>
        ))}
        {/* <option value='custom'>Other</option> */}
      </select>
      <div>
        <p>Enter Link:</p>
        <input
          type='text'
          className='linkInput'
          onChange={(e) => handleLinkChange(e, "platform_link")}
        />
      </div>

      {errMessage && <p className='errMessage'>{errMessage}</p>}

      <button id='addModuleId' onClick={handleAddLinks}>
        Add
      </button>
    </>
  );
};

export default SelectPlatform;
