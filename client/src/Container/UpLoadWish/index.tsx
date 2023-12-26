import React, { useState, useRef, ChangeEvent } from "react";
import "./upLoadWish.css";

import WishUploadImg from "../../Assets/WishImg.png";
import { useWishInfoContext } from "../../Context/wishInfoContextProvider";
import { iWishInfo } from "../../Types/wishListTypes";
import { MdClose } from "react-icons/md";

import { onAddWish } from "../../API/authApi";
import FormatMoney from "../../utils/FormatMoney";
const ALLOWED_EXTENSIONS = /(\.jpg|\.jpeg|\.png|\.webp)$/i;
interface iProps {
  uploadModule: boolean;
  closeUploadModule: () => void;
}

const Index = ({ uploadModule, closeUploadModule }: iProps) => {
  const [wishImg, setWishImg] = useState<File | undefined>();
  const [isError, setIsError] = useState({
    invalidFileTypeErr: "",
    emptyFieldsErr: "",
  });
  const [wishInputs, setWishInputs] = useState<iWishInfo>({} as iWishInfo);
  const ImgInputRef = useRef<HTMLInputElement>(null);
  const { Wishes } = useWishInfoContext();

  const handleImgUpload = () => {
    ImgInputRef?.current?.click();
  };

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const imgFile: File | undefined = e.target?.files?.[0];
    setWishImg(imgFile);

    setWishInputs({ ...wishInputs, wish_image: imgFile });
  };

  //This function is to grape the user inputs from the fields
  // Modify the handleInputChange function
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    let value = e.target.value;
    if (field === "wish_price") {
      //implement the formatMoney function here
    }
    setWishInputs({ ...wishInputs, [field]: value });
  };

  const addTheWish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("wish_name", wishInputs.wish_name);
    formData.append("wish_price", wishInputs.wish_price);
    formData.append("wish_category", wishInputs.wish_category);
    if (wishInputs.wish_image) {
      formData.append("wish_image", wishInputs.wish_image);
    }

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

    Wishes?.push(wishInputs);
    if (uploadModule === true) {
      closeUploadModule();
    }

    try {
      const res = await onAddWish(formData);

      console.log(res);
    } catch (error) {
    } finally {
      console.log("The wish was added successfully");
    }
  };

  return (
    <main className='wishUploaderSection'>
      <MdClose className='editProfileClose' onClick={closeUploadModule} />
      <form onSubmit={(e) => addTheWish(e)}>
        <h3 className='wishInfoTitle'>Wish Information.</h3>
        <div className='wishInfoInputsDiv'>
          <label htmlFor='wishName'>
            Name
            <input
              type='text'
              placeholder='Your wish name'
              value={wishInputs.wish_name}
              id='wishName'
              onChange={(e) => handleInputChange(e, "wish_name")}
            />
          </label>
          <label htmlFor='thePrice'>
            Price
            <input
              type='text'
              placeholder='Enter Amount $:'
              value={wishInputs.wish_price}
              id='thePrice'
              onChange={(e) => handleInputChange(e, "wish_price")}
            />
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
            Categorize your wishes to help gifters find what they're looking for
            on your wishlist.
          </p>
          <div>
            <input
              type='text'
              placeholder='Add a category'
              value={wishInputs.wish_category}
              onChange={(e) => handleInputChange(e, "wish_category")}
            />
            {/* <button className='categoryBtn'>Add</button> */}
          </div>
        </div>
        {isError.emptyFieldsErr && (
          <p className='error'>{isError.emptyFieldsErr}</p>
        )}
        <button className='addWishBtn'>Add The Wish</button>
      </form>
    </main>
  );
};

export default Index;
