import React, { useState } from "react";

import { iCreatorSocialLinks } from "../../Types/creatorSocialLinksTypes";
import { useUserInfoCOntext } from "../../Context/UserProfileContextProvider";

import Insta from "../../Assets/UserIcons/instagram.png";
import Xtwitter from "../../Assets/UserIcons/xTwitter.png";
import OnlyFans from "../../Assets/UserIcons/OnlyFans.png";
import Tiktok from "../../Assets/UserIcons/Tiktok.png";
import ManyVids from "../../Assets/UserIcons/ManyVids.png";
import Twitch from "../../Assets/UserIcons/Twitch.png";
import LoyalFans from "../../Assets/UserIcons/LoyalFans.png";
import Fansly from "../../Assets/UserIcons/Fansly.png";
import Reddit from "../../Assets/UserIcons/Reddit.png";
import Discord from "../../Assets/UserIcons/Discord.png";

type SelectPlatformProps = {
  setLinksModule: (value: boolean) => void;
  linksModule: boolean;
  creatorSocialLinks: iCreatorSocialLinks[] | undefined;
};

const SelectPlatform = ({
  setLinksModule,
  linksModule,
  creatorSocialLinks,
}: SelectPlatformProps) => {
  const [errMessage, setErrMessage] = useState("");
  const [fillingSocialInfo, setFillingSocialInfo] =
    useState<iCreatorSocialLinks>({
      icon: "",
      platform: "",
      platformLinks: "",
    });
  // const { creatorSocialLinks } = useUserInfoCOntext();

  const socialMediaOptions = [
    { icon: Insta, platform: "Instagram" },
    { icon: Xtwitter, platform: "Twitter" },
    { icon: Tiktok, platform: "Tiktok" },
    { icon: OnlyFans, platform: "OnlyFans" },
    { icon: ManyVids, platform: "ManyVids" },
    { icon: Twitch, platform: "Twitch" },
    { icon: LoyalFans, platform: "LoyalFans" },
    { icon: Fansly, platform: "Fansly" },
    { icon: Reddit, platform: "Reddit" },
    { icon: Discord, platform: "Discord" },
  ];

  const handleLinkChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    const value = event?.target?.value;

    if (field === "platform") {
      const selectedPlatform = socialMediaOptions.find(
        (option) => option.platform === value
      );

      if (selectedPlatform) {
        setFillingSocialInfo((prevInfo) => ({
          ...prevInfo,
          [field]: value,
          icon: selectedPlatform.icon,
        }));
      }
    } else {
      setFillingSocialInfo((prevInfo) => ({
        ...prevInfo,
        [field]: value,
      }));
    }
  };

  const handleAddLinks = () => {
    if (!fillingSocialInfo.platform || !fillingSocialInfo.platformLinks) {
      setErrMessage("Please fill in all fields");
      return;
    }
    setErrMessage("");
    setLinksModule(!linksModule); // Close the module
    creatorSocialLinks?.push(fillingSocialInfo as iCreatorSocialLinks);
  };

  return (
    <>
      <select
        onChange={(e) => handleLinkChange(e, "platform")}
        className='platformsSelection'>
        <option value=''>Select Platform</option>
        {socialMediaOptions.map((option) => (
          <option key={option.platform} value={option.platform}>
            {option.platform}
          </option>
        ))}
        <option value='custom'>Other</option>
      </select>
      <div>
        <p>Enter Link:</p>
        <input
          type='text'
          className='linkInput'
          onChange={(e) => handleLinkChange(e, "platformLinks")}
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
