import React, { useEffect, useState } from "react";
import { useWishInfoContext } from "../../Context/wishInfoContextProvider";
import { iWishInfo } from "../../Types/wishListTypes";

const TheWish = () => {
  const { theWishes } = useWishInfoContext();
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  useEffect(() => {
    const getImageURLs = async () => {
      const urls = await Promise.all(
        (theWishes as iWishInfo[])?.map(async (wish) => {
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
    };

    getImageURLs();
  }, [theWishes]);

  console.log(theWishes);

  return (
    <>
      {theWishes?.length ? (
        theWishes?.map((wish, index) => (
          <div key={index}>
            {imageURLs[index] ? <img src={imageURLs[index]} alt='' /> : null}
            <h4>{wish.name}</h4>
            <p>{wish.price}</p>
          </div>
        ))
      ) : (
        <h3>Please Add Your Wishes!</h3>
      )}
    </>
  );
};

export default TheWish;
