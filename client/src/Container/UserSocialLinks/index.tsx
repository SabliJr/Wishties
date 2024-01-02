import React, { useState, useEffect, useRef, useCallback } from "react";
import "./UserSocials.css";

import { useUserInfoCOntext } from "../../Context/UserProfileContextProvider";
import { iCreatorSocialLinks } from "../../Types/creatorSocialLinksTypes";
import { onAddSocialLinks } from "../../API/authApi";

//React Icons
import { CgClose } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";

//Components
import DisplayIcons from "./displayIcons";
import SelectPlatform from "./SelectPlatform";

type SocialMediaLinkFormProps = {
  handleSocialLinksModule: () => void;
  disable_bg: boolean;
};

const SocialMediaLinkForm = ({
  handleSocialLinksModule,
  disable_bg,
}: SocialMediaLinkFormProps) => {
  const [linksModule, setLinksModule] = useState(false);
  const { creatorSocialLinks } = useUserInfoCOntext(); //Create a state for social links;
  const modelRef = useRef<HTMLDivElement | null>(null);

  // This function is to close the module of adding wish when the user clicks outside the module
  const closeModuleOutside = useCallback(
    (e: MouseEvent) => {
      if (modelRef?.current && !modelRef?.current?.contains(e.target as Node)) {
        handleSocialLinksModule();
      }
    },
    [handleSocialLinksModule]
  );

  useEffect(() => {
    document.addEventListener("mouseup", closeModuleOutside);
    return () => {
      document.removeEventListener("mouseup", closeModuleOutside);
    };
  }, [closeModuleOutside]);

  useEffect(() => {
    // Add the 'modal-open' class to the body when the modal is open
    if (disable_bg && !modelRef?.current?.contains(document.activeElement)) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Clean up function
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [disable_bg]);

  const handleSubmit = async () => {
    try {
      const res = await onAddSocialLinks(
        creatorSocialLinks as iCreatorSocialLinks[]
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      handleSocialLinksModule();
    }
  };

  return (
    <>
      <div className='SocialLinksModule'></div>

      <section className='AddingLinksModule' ref={modelRef}>
        <CgClose
          className='closeLinksModule'
          onClick={handleSocialLinksModule}
        />
        <h3 className='UpdateLinks'>Add/Update Your Social Links</h3>

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
          onClick={() => {
            setLinksModule(!linksModule);
          }}>
          Add Link <FaPlus className='linksPlusIcon' />
        </button>
        <button type='submit' className='saveLinks' onClick={handleSubmit}>
          Save Links
        </button>
      </section>
    </>
  );
};

export default SocialMediaLinkForm;
