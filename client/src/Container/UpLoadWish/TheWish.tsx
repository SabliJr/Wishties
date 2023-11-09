import React, { useEffect, useState, useRef } from "react";
import { useWishInfoContext } from "../../Context/wishInfoContextProvider";
import { iWishInfo } from "../../Types/wishListTypes";

const TheWish = (): JSX.Element => {
  const { Wishes } = useWishInfoContext();
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const imageRaf = useRef(undefined);

  useEffect(() => {
    const getImageURLs = async () => {
      const urls = await Promise.all(
        (Wishes as iWishInfo[])?.map(async (wish) => {
          if (wish.image) {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                if (e.target && typeof e.target.result === "string") {
                  resolve(e.target.result);
                }
              };
              reader.readAsDataURL(wish.image as File);
            });
          } else {
            return "";
          }
        })
      );

      setImageURLs(urls);
      console.log(urls);
      // imageRaf?.current?.src = urls;
    };

    getImageURLs();
  }, [Wishes]);
  // console.log(Wishes)
  console.log(imageURLs);


  return (
    <>
      {Wishes?.length ? (
        Wishes?.map((wish, i) => (
          <div key={i} className='theWishDiv'>
            {imageURLs[i] ? (
              <img src={imageURLs[i]} alt='wishImag' className='wishImag'/>
            ) : null}
            {/* <img src={imageURLs[i]} alt='wishImag' className='wishImag' /> */}
            <h4 className='wishTitle'>{wish.name}</h4>
            <p className='wishPrice'>$ {wish.price}</p>
          </div>
        ))
      ) : (
        <h3>Please Add Your Wishes!</h3>
      )}
    </>
  );
};

export default TheWish;
