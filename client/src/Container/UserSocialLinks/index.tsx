import React, { useState, useEffect, useRef } from "react";
import "./UserSocials.css";

import {
  iCreatorDataProvider,
  iCreatorSocialLinks,
} from "../../Types/creatorStuffTypes";
import { onAddSocialLinks, onDeleteSocialLink } from "../../API/authApi";

//React Icons
import { CgClose } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";

//Components
import SelectPlatform from "./SelectPlatform";
import Loader from "../../utils/Loader";

//Context
import { useCreatorData } from "../../Context/CreatorDataProvider";

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
  const [isAdding, setIsAdding] = useState(false);
  const [isError, setIsError] = React.useState("");
  const [link_id, setLink_id] = useState("");
  const [initialSocialLinks, setInitialSocialLinks] = useState<
    iCreatorSocialLinks[]
  >([]);

  const modelRef = useRef<HTMLDivElement | null>(null);
  let {
    creatorSocialLinks,
    displayedSocialLinks,
    setDisplayedSocialLinks,
    setRefreshCreatorData,
  } = useCreatorData() as iCreatorDataProvider;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setInitialSocialLinks(displayedSocialLinks as iCreatorSocialLinks[]);
  }, [displayedSocialLinks]);

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

  const handleDelete = async (link_id: string) => {
    const newLinks = displayedSocialLinks?.filter(
      (x: iCreatorSocialLinks) => x.link_id !== link_id
    );
    setDisplayedSocialLinks(newLinks || []);

    setDisable_btn(false);
    setLink_id(link_id);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (isAdding)
        await onAddSocialLinks(displayedSocialLinks as iCreatorSocialLinks[]);
      await onDeleteSocialLink(link_id);
      setRefreshCreatorData(true);
    } catch (error) {
      if (error) {
        setIsError("Something went wrong deleting link, please try again!");
      }
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
        {(displayedSocialLinks as iCreatorSocialLinks[])?.length > 0 ? (
          <>
            {displayedSocialLinks?.map((x: iCreatorSocialLinks) => (
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
            ))}

            {isError && <p className='error'>{isError}</p>}
          </>
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
              setIsAdding={setIsAdding}
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
