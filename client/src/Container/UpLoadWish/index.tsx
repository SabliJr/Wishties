import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import "./upLoadWish.css";

import WishUploadImg from "../../Assets/WishImg.png";
import { useCreatorData } from "../../Context/CreatorDataProvider";
import { iCreatorDataProvider } from "../../Types/creatorStuffTypes";

import { iWishInfo } from "../../Types/wishListTypes";
import { MdClose } from "react-icons/md";

import { onAddWish } from "../../API/authApi";
import Loader from "../../utils/Loader";

const ALLOWED_EXTENSIONS = /(\.jpg|\.jpeg|\.png|\.webp)$/i;
interface iProps {
  uploadModule: boolean;
  closeUploadModule: () => void;
  modalOpen: boolean;
}

const Index = ({ uploadModule, closeUploadModule, modalOpen }: iProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [wishImg, setWishImg] = useState<File | undefined>();
  const [isError, setIsError] = useState({
    invalidFileTypeErr: "",
    emptyFieldsErr: "",
  });
  const [wishInputs, setWishInputs] = useState<iWishInfo>({} as iWishInfo);
  const ImgInputRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLDivElement | null>(null);
  let { setRefreshCreatorData } = useCreatorData() as iCreatorDataProvider;

  const handleImgUpload = () => {
    ImgInputRef?.current?.click();
  };

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const imgFile: File | undefined = e.target?.files?.[0];
    setWishImg(imgFile);

    setWishInputs({ ...wishInputs, wish_image: imgFile });
  };

  useEffect(() => {
    // Add the 'modal-open' class to the body when the modal is open
    if (modalOpen && !modelRef?.current?.contains(document.activeElement)) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Clean up function
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [modalOpen]);

  //This function is to grape the user's inputs from the fields
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    let value = e.target.value;
    setWishInputs({ ...wishInputs, [field]: value });
  };

  const addTheWish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error state
    setIsError({
      invalidFileTypeErr: "",
      emptyFieldsErr: "",
    });

    const formData = new FormData();
    if (
      !wishInputs.wish_name ||
      !wishInputs.wish_price ||
      !wishInputs.wish_image
    ) {
      setIsError((prev) => ({
        ...prev,
        emptyFieldsErr: "Please fill in all your wish details.",
      }));

      return;
    }

    if (
      wishInputs.wish_image &&
      !ALLOWED_EXTENSIONS.exec(wishInputs.wish_image.name)
    ) {
      setIsError((prev) => ({
        ...prev,
        invalidFileTypeErr:
          "Please upload file having extensions .jpeg/.jpg/.png/.webp only.",
      }));

      return;
    }

    if (
      isNaN(Number(wishInputs.wish_price)) ||
      Number(wishInputs.wish_price) < 1
    ) {
      setIsError((prev) => ({
        ...prev,
        emptyFieldsErr: "Please enter a valid price.",
      }));
      return;
    }

    formData.append("wish_name", wishInputs.wish_name);
    formData.append("wish_price", wishInputs.wish_price);
    formData.append("wish_category", wishInputs.wish_category);
    if (wishInputs.wish_image) {
      formData.append("wish_image", wishInputs.wish_image);
    }

    // Set isUploading to true only after all validations have passed
    setIsUploading(true);

    try {
      await onAddWish(formData);
      setRefreshCreatorData(true);
    } catch (error: any) {
      // Set an error state here to inform the user about the error
      setIsError((prev) => ({
        ...prev,
        serverError: error.message,
      }));
    } finally {
      if (uploadModule === true) {
        closeUploadModule();
      }
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className='dropBack'></div>
      {isUploading && !Object.values(isError).some((value) => value !== "") && (
        <Loader />
      )}
      <main className='wishUploaderSection' ref={modelRef}>
        <MdClose className='editProfileClose' onClick={closeUploadModule} />
        <form onSubmit={(e) => addTheWish(e)}>
          <h3 className='wishInfoTitle'>Wish Information.</h3>
          <div className='wishInfoInputsDiv'>
            <label htmlFor='wishName'>
              Name
              <input
                type='text'
                placeholder='Your wish name'
                value={wishInputs.wish_name ? wishInputs.wish_name : ""}
                id='wishName'
                onChange={(e) => {
                  handleInputChange(e, "wish_name");
                  setIsError((prev) => ({ ...prev, emptyFieldsErr: "" }));
                }}
                maxLength={36}
              />
            </label>
            <label htmlFor='thePrice'>
              Price
              <input
                type='text'
                placeholder='Enter Amount $:'
                value={wishInputs.wish_price ? wishInputs.wish_price : ""}
                id='thePrice'
                onChange={(e) => {
                  handleInputChange(e, "wish_price");
                  setIsError((prev) => ({ ...prev, emptyFieldsErr: "" }));
                }}
              />
              <p className='_price_caution'>
                ⚠️ &nbsp; Attention: 10% fee is applied to this amount!
              </p>
            </label>
          </div>
          <div className='imgUploaderDiv' onClick={handleImgUpload}>
            {wishImg ? (
              <img
                src={URL.createObjectURL(wishImg)}
                alt='wishUploadImg'
                className='wishUploadImg'
              />
            ) : (
              <img
                src={WishUploadImg}
                alt='wishUploadImg'
                className='wishUploadImg'
              />
            )}

            <p className='UploadAnImage'>Upload an image.</p>
            <input
              type='file'
              id='image_uploads'
              name='image_uploads'
              accept='.jpg, .jpeg, .png, .webp'
              ref={ImgInputRef}
              style={{ display: "none" }}
              onChange={handleImgChange}
            />
          </div>
          {isError.invalidFileTypeErr && (
            <p className='error'>{isError.invalidFileTypeErr}</p>
          )}
          <div className='categoriesDiv'>
            <h4>
              Publish <span>(optional)</span>{" "}
            </h4>
            <p>
              Categorize your wishes to help gifters find what they're looking
              for on your wishlist.
            </p>
            <div>
              <input
                type='text'
                placeholder='Add a category'
                value={wishInputs.wish_category || ""}
                onChange={(e) => {
                  handleInputChange(e, "wish_category");
                  setIsError((prev) => ({ ...prev, emptyFieldsErr: "" }));
                }}
              />
            </div>
          </div>
          {isError.emptyFieldsErr && (
            <p className='errorMsg'>{isError.emptyFieldsErr}</p>
          )}
          <button className='addWishBtn' disabled={isUploading}>
            Add The Wish
          </button>
        </form>
      </main>
    </>
  );
};

export default Index;
