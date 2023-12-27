import React, { useEffect, useState, useRef } from "react";
import { useWishInfoContext } from "../../Context/wishInfoContextProvider";
import { iWishInfo } from "../../Types/wishListTypes";

import { FaCartPlus } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

const TheWish = (): JSX.Element => {
  const { Wishes } = useWishInfoContext();
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const getImageURLs = async () => {
      const urls = await Promise.all(
        (Wishes as iWishInfo[])?.map(async (wish) => {
          if (wish.wish_image) {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                if (e.target && typeof e.target.result === "string") {
                  resolve(e.target.result);
                }
              };
              reader.readAsDataURL(wish.wish_image as File);
            });
          } else {
            return "";
          }
        })
      );

      setImageURLs(urls);
    };

    getImageURLs();

    //To Update the image when the image is uploaded
    Wishes?.map((w: iWishInfo, i: number) => {
      if (imageURLs[i]) {
        imageRef.current?.setAttribute("src", imageURLs[i]);
      } else {
        imageRef.current?.setAttribute("src", "");
      }
    });
  }, [Wishes, imageURLs]);

  const handleEdit = () => {
    console.log("edit");
  };

  return (
    <>
      {Wishes?.length ? (
        Wishes?.map((wish, i) => (
          <div key={i} className='theWishDiv'>
            <img ref={imageRef} alt='wishImag' className='wishImag' />
            <div className='wishDetails'>
              <div>
                <h4 className='wishTitle'>{wish.wish_name}</h4>
                <p className='wishPrice'>${wish.wish_price}</p>
              </div>
              <div className='wishOptionBtn' onClick={handleEdit}>
                <HiDotsVertical className='wishOptionBtnIcon' />
              </div>
            </div>
            <button className='addToCartBtn'>
              <FaCartPlus className='addToCartBtnIcon' />
              Add To Cart
            </button>
          </div>
        ))
      ) : (
        <h3>Please Add Your Wishes!</h3>
      )}
    </>
  );
};

export default TheWish;
