import React, { useEffect, useState, useContext } from "react";
import { iWish } from "../../Types/wishListTypes";
import { onGetWishes } from "../../API/authApi";
import Loader from "../../Loader";

import { FaCartPlus } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues } from "../../Types/creatorSocialLinksTypes";

const TheWish = (): JSX.Element => {
  const [creatorWishes, setCreatorWishes] = useState<iWish[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { refresh, setRefresh } = contextValues as iGlobalValues;

  useEffect(() => {
    (async () => {
      try {
        const wishes = await onGetWishes();
        setCreatorWishes(wishes.data.wishes as iWish[]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoaded(false);
      }
    })();
    setRefresh(false);
  }, [refresh, setRefresh]);

  const handleEdit = () => {
    console.log("edit");
  };

  return (
    <>
      {isLoaded ? (
        <Loader />
      ) : creatorWishes && creatorWishes.length > 0 ? (
        creatorWishes?.map((x) => (
          <div key={x.wish_id} className='theWishDiv'>
            <img src={x.wish_image} alt='wishImag' className='wishImag' />
            <div className='wishDetails'>
              <div>
                <h4 className='wishTitle'>{x.wish_name}</h4>
                <p className='wishPrice'>${x.wish_price}</p>
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
