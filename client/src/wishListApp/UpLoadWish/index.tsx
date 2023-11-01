import React, { useState, useRef, ChangeEvent } from "react";
import "./upLoadWish.css";

import WishUploadImg from "../../Assets/WishImg.png";

const Index = () => {
  const [wishImg, setWishImg] = useState<File | undefined>();
  const ImgInputRef = useRef<HTMLInputElement>(null);

  const handleImgUpload = () => {
    ImgInputRef?.current?.click();
  };

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const imgFile: File | undefined = e.target?.files?.[0];
    setWishImg(imgFile);
  };

  return (
    <main className='wishUploaderSection'>
      <h3>Wish Information</h3>
      <div className='wishInfoInputsDiv'>
        <input type='text' placeholder='Your wish name' />
        <input type='text' placeholder='Price' />
      </div>
      <div className='imgUploaderDiv' onClick={handleImgUpload}>
        {wishImg ? (
          <img
            src={URL.createObjectURL(wishImg)}
            alt='WishUploadImg'
            className='wishUploadImg'
          />
        ) : (
          <img
            src={WishUploadImg}
            alt='WishUploadImg'
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
