import React, { useState } from "react";
import "./UserSocials.css";

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

const SocialMediaLinkForm = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [link, setLink] = useState("");

  const socialMediaOptions = [
    { platform: "Instagram", icon: Insta },
    { platform: "Twitter", icon: Xtwitter },
    { platform: "Tiktok", icon: Tiktok },
    { platform: "OnlyFans", icon: OnlyFans },
    { platform: "ManyVids", icon: ManyVids },
    { platform: "Twitch", icon: Twitch },
    { platform: "LoyalFans", icon: LoyalFans },
    { platform: "Fansly", icon: Fansly },
    { platform: "Reddit", icon: Reddit },
    { platform: "Discord", icon: Discord },
  ];

  const handlePlatformChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPlatform(event?.target.value);
  };

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLink(event?.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle the submission of social media link (e.g., send to server)
    console.log(`Selected Platform: ${selectedPlatform}, Link: ${link}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Select Social Media Platform:
        <select value={selectedPlatform} onChange={handlePlatformChange}>
          <option value=''>Select Platform</option>
          {socialMediaOptions.map((option) => (
            <option key={option.platform} value={option.platform}>
              {option.platform}
            </option>
          ))}
          <option value='custom'>Custom</option>
        </select>
      </label>

      {selectedPlatform && (
        <div>
          <label>
            Enter Link:
            <input type='text' value={link} onChange={handleLinkChange} />
          </label>

          <button type='submit'>Save Link</button>
        </div>
      )}

      {selectedPlatform === "custom" && (
        <div>
          {/* Additional fields for custom social media option if needed */}
        </div>
      )}

      {selectedPlatform && (
        <div>
          <p>Selected Platform: {selectedPlatform}</p>
          <img
            src={
              selectedPlatform === "custom"
                ? "custom-icon.png" // Replace with the custom icon for the custom option
                : socialMediaOptions.find(
                    (option) => option.platform === selectedPlatform
                  )?.icon
            }
            alt={`${selectedPlatform} Icon`}
            style={{ width: "30px", height: "30px" }}
          />
        </div>
      )}
    </form>
  );
};

export default SocialMediaLinkForm;
