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
  socialLinksModule: Boolean;
  handleSocialLinksModule: () => void;
  socialsModal: boolean;
};

const SocialMediaLinkForm = ({
  socialLinksModule,
  handleSocialLinksModule,
  socialsModal,
}: SocialMediaLinkFormProps) => {
  const [linksModule, setLinksModule] = useState(false);
  // const [creatorSocialLinks, setCreatorSocialLinks] = useState<
  //   iCreatorSocialLinks[]
  // >([]);
  const { creatorSocialLinks } = useUserInfoCOntext();
  const modelRef = useRef<HTMLDivElement | null>(null);
  // const creatorSocialLinks: iCreatorSocialLinks[] = []; //Create a state for social links

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
    if (socialsModal && !modelRef?.current?.contains(document.activeElement)) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Clean up function
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [socialsModal]);

  const handleSubmit = async () => {
    // You can handle submission logic here if needed

    const formData = new FormData();
    creatorSocialLinks?.forEach((x: iCreatorSocialLinks) => {
      formData.append("icon", x.icon);
      formData.append("platform", x.platform);
      formData.append("platformLinks", x.platformLinks);
    });

    // for (let pair of formData?.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(`${key}, ${value}`);
    });

    try {
      const res = await onAddSocialLinks(formData);
      console.log(res);
    } catch (error) {
    } finally {
      handleSocialLinksModule();
    }

    // Send the data to the backend/database by calling an API
    // Send the images to the cloud storage S3 bucket
    // Then update the state of the user profile context
    // Add loading spinner while the data is being sent to the backend/database

    // After the data is sent to the backend/database, you can reset the form
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
          <DisplayIcons creatorSocialLinks={creatorSocialLinks} />
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
              creatorSocialLinks={creatorSocialLinks}
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
