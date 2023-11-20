import React, { useState } from "react";
import "./UserSocials.css";

import { useUserInfoCOntext } from "../../Context/UserProfileContextProvider";
import { iCreatorSocialLinks } from "../../Types/creatorSocialLinksTypes";


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

//React Icons
import { CgClose } from "react-icons/cg";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";

type SocialMediaLinkFormProps = {
  socialLinksModule: Boolean;
  handleSocialLinksModule: () => void;
};

const SocialMediaLinkForm = ({
  socialLinksModule,
  handleSocialLinksModule,
}: SocialMediaLinkFormProps) => {
  const [linksModule, setLinksModule] = useState(false);
  const [fillingSocialInfo, setFillingSocialInfo] =
    useState<iCreatorSocialLinks>({
      link: "",
      icon: "",
      platformName: "",
    });
  const { creatorSocialLinks } = useUserInfoCOntext();

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
        setFillingSocialInfo({
          ...fillingSocialInfo,
          [field]: value,
          icon: selectedPlatform.icon,
        });
      }
    } else {
      setFillingSocialInfo({ ...fillingSocialInfo, [field]: value });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // You can handle submission logic here if needed
  };

  const handleAddLinks = () => {
    setLinksModule(!linksModule);
    // setCreatorSocialLinks((prevLinks) => [...prevLinks, fillingSocialInfo]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className='AddingLinksModule'>
        <CgClose
          className='closeLinksModule'
          onClick={handleSocialLinksModule}
        />
        <h3>Add/Update Your Social Links</h3>
        {(creatorSocialLinks as iCreatorSocialLinks[])?.length > 0 ? (
          creatorSocialLinks?.map((link: iCreatorSocialLinks) => {
            return (
              <div key={link.platformName}>
                <div>
                  <img
                    src={link.icon}
                    alt={`${link.icon} Icon`}
                    style={{ width: "30px", height: "30px" }}
                  />
                  <p>{link.platformName}</p>
                </div>
                <div>
                  <FiEdit />
                  <MdDelete />
                </div>
              </div>
            );
          })
        ) : (
          <div>
            <p>You have not added any social media links yet.</p>
          </div>
        )}

        {linksModule ? (
          <label className='linksLabel'>
            <RiCloseFill
              className='closeLinksModule'
              style={{
                top: ".42rem",
                fontSize: "1rem",
              }}
              onClick={() => setLinksModule(!linksModule)}
            />

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

            <button id='addModuleId' onClick={handleAddLinks}>
              Add
            </button>
          </label>
        ) : null}
        <button
          className='addLinksBtn'
          onClick={() => setLinksModule(!linksModule)}>
          Add Links <FaPlus className='linksPlusIcon' />
        </button>
        <button type='submit' className='saveLinks'>
          Save Links
        </button>
      </section>
    </form>
  );
};

export default SocialMediaLinkForm;
