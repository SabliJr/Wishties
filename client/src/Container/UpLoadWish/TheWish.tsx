import React, { useEffect, useState } from "react";
import { useWishInfoContext } from "../../Context/wishInfoContextProvider";
import { iWishInfo } from "../../Types/wishListTypes";

const TheWish = (): JSX.Element => {
  const { Wishes } = useWishInfoContext();
  const [imageURLs, setImageURLs] = useState<string[]>([]);

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
      // console.log(urls);
    };

    getImageURLs();
  }, [Wishes]);
  console.log(imageURLs);
  // console.log(Wishes);

  return (
    <>
      {Wishes?.length ? (
        Wishes?.map((wish, i) => (
          <div key={i} className='theWishDiv'>
            {imageURLs[i] ? (
              <img src={imageURLs[i]} alt='wishImag' className='wishImag' />
            ) : null}
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
