import React, { useState } from "react";
import "./UserSocials.css";

import { useUserInfoCOntext } from "../../Context/UserProfileContextProvider";
import { iCreatorSocialLinks } from "../../Types/creatorSocialLinksTypes";

//React Icons
import { CgClose } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";

//Components
import DisplayIcons from "./displayIcons";
import SelectPlatform from "./SelectPlatform";

type SocialMediaLinkFormProps = {
  socialLinksModule: Boolean;
  handleSocialLinksModule: () => void;
};

const SocialMediaLinkForm = ({
  socialLinksModule,
  handleSocialLinksModule,
}: SocialMediaLinkFormProps) => {
  const [linksModule, setLinksModule] = useState(false);
  const { creatorSocialLinks } = useUserInfoCOntext();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // You can handle submission logic here if needed
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className='AddingLinksModule'>
        <CgClose
          className='closeLinksModule'
          onClick={handleSocialLinksModule}
        />
        <h3 className="UpdateLinks">Add/Update Your Social Links</h3>

        {/* Display the icons if there are any links */}
        {(creatorSocialLinks as iCreatorSocialLinks[])?.length > 0 ? (
          <DisplayIcons />
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

            <SelectPlatform
              setLinksModule={setLinksModule}
              linksModule={linksModule}
            />
          </label>
        ) : null}
        <button
          className='addLinksBtn'
          onClick={() => setLinksModule(!linksModule)}>
          Add Link <FaPlus className='linksPlusIcon' />
        </button>
        <button type='submit' className='saveLinks'>
          Save Links
        </button>
      </section>
    </form>
  );
};

export default SocialMediaLinkForm;
