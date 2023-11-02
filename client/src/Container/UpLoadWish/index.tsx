import React, { useState, useRef, ChangeEvent } from "react";
import "./upLoadWish.css";

import WishUploadImg from "../../Assets/WishImg.png";
import { useWishInfoContext } from "../../Context/wishInfoContextProvider";
import { iWishInfo } from "../../Types/wishListTypes";

interface iProps {
  uploadModule: boolean;
  closeUploadModule: () => void;
}

const Index = ({ uploadModule, closeUploadModule }: iProps) => {
  const [wishImg, setWishImg] = useState<File | undefined>();
  const [wishInputs, setWishInputs] = useState<iWishInfo>({
    name: "",
    price: "",
    image: undefined,
    category: "",
  });
  const ImgInputRef = useRef<HTMLInputElement>(null);
  const { theWishes } = useWishInfoContext();

  const handleImgUpload = () => {
    ImgInputRef?.current?.click();
  };

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const imgFile: File | undefined = e.target?.files?.[0];
    setWishImg(imgFile);

    setWishInputs({ ...wishInputs, image: imgFile });
  };

  //This function is to grape the user inputs from the fields
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;
    setWishInputs({ ...wishInputs, [field]: value });
  };

  const addTheWish = () => {
    // Assuming you want to add the wish to an array of wishes in your context
    // You can update wishInfo and add it to your context as needed
    const updatedWishInfo = { ...wishInputs };
    theWishes?.push(updatedWishInfo);

    // Here, you can add the updatedWishInfo to your context or perform any other actions

    // For example, you can update the context with the new wish
    //  setWishInfo(wishInputs);

    // Reset the form or take other actions as needed
    //  resetForm();

    if (uploadModule === true) {
      closeUploadModule();
    }
  };

  return (
    <main className='wishUploaderSection'>
      <h3 className='wishInfoTitle'>Wish Information.</h3>
      <div className='wishInfoInputsDiv'>
        <label htmlFor='wishName'>
          Name
          <input
            type='text'
            placeholder='Your wish name'
            id='wishName'
            onChange={(e) => handleInputChange(e, "name")}
            required
          />
        </label>
        <label htmlFor='thePrice'>
          Price
          <input
            type='text'
            placeholder='$'
            id='thePrice'
            onChange={(e) => handleInputChange(e, "price")}
            required
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
          required
          onChange={handleImgChange}
        />
      </div>

      <div className='categoriesDiv'>
        <h4>
          Publish <span>(optional)</span>{" "}
        </h4>
        <p>
          Categorize your wishes to help gifters find what they're looking for
          on your wishlist.
        </p>
        <div>
          <input type='text' placeholder='Add a category' />
          <button className='categoryBtn'>Add</button>
        </div>
      </div>
      <button className='addWishBtn' onClick={addTheWish}>
        Add The Wish
      </button>
    </main>
  );
};

export default Index;
