import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import "./upLoadWish.css";

import WishUploadImg from "../../Assets/WishImg.png";
import { useWishInfoContext } from "../../Context/wishInfoContextProvider";
import { iWishInfo } from "../../Types/wishListTypes";
import { MdClose } from "react-icons/md";

interface iProps {
  uploadModule: boolean;
  closeUploadModule: () => void;
}

const Index = ({ uploadModule, closeUploadModule }: iProps) => {
  const [wishImg, setWishImg] = useState<File | undefined>();
  const [wishPrice, setWishPrice] = useState("");
  const [wishInputs, setWishInputs] = useState<iWishInfo>({
    name: "",
    image: undefined,
    price: null,
    category: "",
  });
  const ImgInputRef = useRef<HTMLInputElement>(null);
  const { Wishes } = useWishInfoContext();

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
    const updatedWishInfo = { ...wishInputs, wishPrice };
    Wishes?.push(updatedWishInfo);

    // Here, you can add the updatedWishInfo to your context or perform any other actions

    // For example, you can update the context with the new wish
    //  setWishInfo(wishInputs);

    // Reset the form or take other actions as needed
    //  resetForm();

    if (uploadModule === true) {
      closeUploadModule();
    }
  };

  // Formatting the currency.
  useEffect(() => {
    const currencyFormatter = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });
    // console.log(currencyFormatter.format(+wishPrice));
    // console.log(currencyFormatter.format(num));
    const num_format = currencyFormatter.format(+wishPrice);
    if (!isNaN(+num_format)) {
      console.log(`The formatted one: ${num_format}`);
      setWishPrice(num_format);
    }
  }, [wishPrice]);
  console.log(wishPrice);

  return (
    <main className='wishUploaderSection'>
      <MdClose className='editProfileClose' onClick={closeUploadModule} />
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
            placeholder='Enter Amount $:'
            value={wishPrice}
            id='thePrice'
            onChange={(e) => setWishPrice(e.target.value)}
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
