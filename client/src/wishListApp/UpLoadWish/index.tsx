import React, { useState, useRef, ChangeEvent } from "react";
import "./upLoadWish.css";

import WishUploadImg from "../../Assets/WishImg.png";
interface iWishInfo {
  name: string;
  price: string;
  image: File | undefined;
  category: string;
}

const Index = () => {
  const [wishImg, setWishImg] = useState<File | undefined>();
  const ImgInputRef = useRef<HTMLInputElement>(null);
  const [wishInfo, setWishInfo] = useState<iWishInfo>({
    name: "",
    price: "",
    image: undefined, // Initialize image as undefined
    category: "",
  });

  const handleImgUpload = () => {
    ImgInputRef?.current?.click();
  };

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const imgFile: File | undefined = e.target?.files?.[0];
    setWishImg(imgFile);
  };
  //This function is to grape the user inputs from the fields
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;
    setWishInfo({ ...wishInfo, [field]: value });
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
          />
        </label>
        <label htmlFor='thePrice'>
          Price
          <input
            type='text'
            placeholder='$'
            id='thePrice'
            onChange={(e) => handleInputChange(e, "price")}
          />
        </label>
      </div>
      <div className='imgUploaderDiv' onClick={handleImgUpload}>
        {wishImg ? (
          <img
            src={URL.createObjectURL(wishImg as File)}
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
      <button className='addWishBtn'>Add The Wish</button>
    </main>
  );
};

export default Index;
