import React, { useState, useRef, useEffect } from "react";
import "./upLoadWish.css";

import { onEditWish } from "../../API/authApi";
import { iCart } from "../../Types/wishListTypes";
import { MdClose } from "react-icons/md";
import Loader from "../../utils/Loader";

import { useCreatorData } from "../../Context/CreatorDataProvider";
import { iCreatorDataProvider } from "../../Types/creatorStuffTypes";
interface iEditWishProps {
  wishToEdit: iCart | null;
  setWishToEdit: React.Dispatch<React.SetStateAction<iCart | null>>;
}

const ALLOWED_EXTENSIONS = /(\.jpg|\.jpeg|\.png|\.webp)$/i;
const EditWish = ({ wishToEdit, setWishToEdit }: iEditWishProps) => {
  const [comparedWish, setComparedWish] = useState<iCart | null>(null);
  const [disable_btn, setDisable_btn] = useState(false);
  const [isError, setIsError] = useState({
    invalidFileTypeErr: "",
    emptyFieldsErr: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [wishImage, setWishImage] = useState<File | undefined>();
  const ImgInputRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLDivElement | null>(null);

  let { setRefreshCreatorData } = useCreatorData() as iCreatorDataProvider;

  const handleImgUpload = () => {
    ImgInputRef?.current?.click();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (wishToEdit) {
      setComparedWish(wishToEdit);
    }
  }, []);

  useEffect(() => {
    if (JSON.stringify(comparedWish) === JSON.stringify(wishToEdit)) {
      setDisable_btn(true);
    } else {
      setDisable_btn(false);
    }
  }, [comparedWish, wishToEdit]);

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile: File | undefined = e.target?.files?.[0];
    setWishImage(imgFile);
    setWishToEdit({ ...wishToEdit, wish_image: imgFile as File } as iCart);
  };

  const handleEditInputs = (
    e: React.ChangeEvent<HTMLInputElement>,
    filed: string
  ) => {
    let value = e.target.value;
    let editedWish = { ...wishToEdit, [filed]: value };

    setWishToEdit(editedWish as iCart);
  };

  useEffect(() => {
    // Add the 'modal-open' class to the body when the modal is open
    if (wishToEdit && !modelRef?.current?.contains(document.activeElement)) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Clean up function
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [wishToEdit]);

  const handleUpdateWish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formData = new FormData();

    if (!wishToEdit?.wish_name || !wishToEdit.wish_price) {
      setIsError((prev) => ({
        ...prev,
        emptyFieldsErr: "Please fill all the fields.",
      }));
      return;
    }

    formData.append("wish_id", wishToEdit.wish_id as string);
    formData.append("wish_name", wishToEdit.wish_name as string);
    formData.append("wish_price", wishToEdit?.wish_price as string);
    formData.append("wish_category", wishToEdit.wish_category as string);
    if (wishToEdit.wish_image !== comparedWish?.wish_image && wishImage)
      formData.append("wish_image", wishToEdit.wish_image as File);

    if (
      wishToEdit.wish_image instanceof File &&
      !ALLOWED_EXTENSIONS.exec(wishToEdit?.wish_image?.name)
    ) {
      setIsError((prev) => ({
        ...prev,
        invalidFileTypeErr:
          "Please upload file having extensions .jpeg/.jpg/.png/.webp only.",
      }));

      return;
    }

    setIsUpdating(true);
    try {
      await onEditWish(formData);
      setRefreshCreatorData(true);
    } catch (error) {
      console.log(error);
    } finally {
      setWishToEdit(null);
      setIsUpdating(false);
    }
  };

  return (
    <>
      {isUpdating && <Loader />}
      <div className='dropBack'></div>

      <div className='wishUploaderSection' ref={modelRef}>
        <MdClose
          className='editProfileClose'
          onClick={() => setWishToEdit(null)}
        />

        <form onSubmit={(e) => handleUpdateWish(e)}>
          <h3 className='wishInfoTitle'>Wish Information.</h3>
          <div className='wishInfoInputsDiv'>
            <label htmlFor='wishName'>
              Name
              <input
                type='text'
                placeholder='Your wish name'
                value={wishToEdit?.wish_name ? wishToEdit.wish_name : ""}
                id='wishName'
                onChange={(e) => {
                  handleEditInputs(e, "wish_name");
                  setIsError((prev) => ({ ...prev, emptyFieldsErr: "" }));
                }}
              />
            </label>
            <label htmlFor='thePrice'>
              Price
              <input
                type='text'
                placeholder='Enter Amount $:'
                value={wishToEdit?.wish_price ? wishToEdit.wish_price : ""}
                id='thePrice'
                onChange={(e) => {
                  handleEditInputs(e, "wish_price");
                  setIsError((prev) => ({ ...prev, emptyFieldsErr: "" }));
                }}
              />
            </label>
          </div>
          <div className='imgUploaderDiv' onClick={handleImgUpload}>
            {wishImage ? (
              <img
                src={URL.createObjectURL(wishImage as File)}
                alt='wishUploadImg'
                className='wishUploadImg'
              />
            ) : (
              <img
                src={wishToEdit?.wish_image as string}
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
                value={wishToEdit?.wish_category || ""}
                onChange={(e) => {
                  handleEditInputs(e, "wish_category");
                  setIsError((prev) => ({ ...prev, emptyFieldsErr: "" }));
                }}
              />
            </div>
          </div>
          {isError.emptyFieldsErr && (
            <p className='errorMsg'>{isError.emptyFieldsErr}</p>
          )}
          <button className='addWishBtn' disabled={disable_btn}>
            Update Wish
          </button>
        </form>
      </div>
    </>
  );
};

export default EditWish;
