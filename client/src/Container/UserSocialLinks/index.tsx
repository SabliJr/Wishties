import React, { useState } from "react";
import "./UserSocials.css";

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

import { CgClose } from "react-icons/cg";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

type SocialMediaLinkFormProps = {
  socialLinksModule: Boolean;
  handleSocialLinksModule: () => void;
};

type socialLinksType = {
  platform: string;
  platformLink: string;
}[];


const SocialMediaLinkForm = ({
  socialLinksModule,
  handleSocialLinksModule,
}: SocialMediaLinkFormProps) => {
  // const [selectedPlatform, setSelectedPlatform] = useState("");
  // const [platform, setPlatform] = useState("");
  // const [link, setLink] = useState("");
  const [socialLinks, setSocialLinks] = useState<
    socialLinksType | React.SetStateAction<socialLinksType>
  >([
    {
      platform: "",
      platformLink: "",
    },
  ]); // This will be an array of objects [{platform: "Instagram", link: "https://www.instagram.com/angela_smith"}, {platform: "Twitter", link: "https://www.twitter.com/angela_smith"}]

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

  // const handlePlatformChange = (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   setSelectedPlatform(event?.target.value);
  // };

  const handleLinkChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    const value = event?.target?.value;
    // setSocialLinks({ ...socialLinks, [field]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle the submission of social media link (e.g., send to server)
    // console.log(`Selected Platform: ${selectedPlatform}, Link: ${link}`);
  };


  return (
    <section className='AddingLinksModule'>
      <CgClose className='closeLinksModule' onClick={handleSocialLinksModule} />
      <h3>Add/Update Your Social Links</h3>
      <form onSubmit={handleSubmit}>
        <label>
          <select onChange={(e) => handleLinkChange(e, "platform")}>
            <option value=''>Select Platform</option>
            {socialMediaOptions.map((option) => (
              <option key={option.platform} value={option.platform}>
                {" "}
                {/* value={selectedPlatform} */}
                <img src={option.icon} alt='' />
                {option.platform}
              </option>
            ))}
            <option value='custom'>Custom</option>
          </select>
          <div>
            <label>
              Enter Link:
              <input
                type='text'
                // value={socialLinks}
                onChange={(e) => handleLinkChange(e, "platformLinks")}
              />
            </label>
          </div>
        </label>
      
        {creatorSocialLinks ? (
          creatorSocialLinks?.map((link) => {
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
            <button>Add Links</button>
          </div>
        )}
        <button type='submit' className='saveLinks'>
          Save Links
        </button>
      </form>
    </section>
  );
};

export default SocialMediaLinkForm;
