import React, { useState, useEffect, useRef } from "react";
import "./UserSocials.css";

import { useUserInfoCOntext } from "../../Context/UserProfileContextProvider";
import { iCreatorSocialLinks } from "../../Types/creatorStuffTypes";
import { onAddSocialLinks } from "../../API/authApi";

//React Icons
import { CgClose } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";

//Components
import DisplayIcons from "./displayIcons";
import SelectPlatform from "./SelectPlatform";
import Loader from "../../utils/Loader";

type SocialMediaLinkFormProps = {
  handleSocialLinksModule: () => void;
  disable_bg: boolean;
};

const SocialMediaLinkForm = ({
  handleSocialLinksModule,
  disable_bg,
}: SocialMediaLinkFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [linksModule, setLinksModule] = useState(false);
  const [disable_btn, setDisable_btn] = useState(false);
  const { creatorSocialLinks, setRefetchIcons } = useUserInfoCOntext(); //Create a state for social links;
  const modelRef = useRef<HTMLDivElement | null>(null);

  const [initialSocialLinks, setInitialSocialLinks] = useState<
    iCreatorSocialLinks[]
  >([]);

  // Remove the dependency on creatorSocialLinks from the first useEffect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setInitialSocialLinks(creatorSocialLinks as iCreatorSocialLinks[]);
  }, []); // This runs only once when the component mounts

  useEffect(() => {
    if (
      JSON.stringify(creatorSocialLinks) === JSON.stringify(initialSocialLinks)
    ) {
      setDisable_btn(true);
    } else {
      setDisable_btn(false);
    }
  }, [creatorSocialLinks, initialSocialLinks]);

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
    setIsLoading(true);

    try {
      await onAddSocialLinks(creatorSocialLinks as iCreatorSocialLinks[]);
      setRefetchIcons(true);
    } catch (error) {
      console.log(error);
    } finally {
      handleSocialLinksModule();
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='SocialLinksModule'></div>
      {isLoading && <Loader />}
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
        <button
          type='submit'
          className='saveLinks'
          onClick={handleSubmit}
          disabled={disable_btn}>
          Save Links
        </button>
      </section>
    </>
  );
};

export default SocialMediaLinkForm;
