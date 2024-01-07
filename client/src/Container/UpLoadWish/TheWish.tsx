import React, { useEffect, useState, useContext } from "react";
import { iWish } from "../../Types/wishListTypes";
import { onGetWishes, onRemoveWish } from "../../API/authApi";
import Loader from "../../Loader";
import EditWish from "./EditWish";

import { FaCartPlus } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { TbEdit } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import { RiCloseLine } from "react-icons/ri";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues } from "../../Types/creatorSocialLinksTypes";

const TheWish = (): JSX.Element => {
  const [creatorWishes, setCreatorWishes] = useState<iWish[]>([]);
  const [editingWishId, setEditingWishId] = useState<null | string>(null);
  const [wishToEdit, setWishToEdit] = useState<iWish | null>(null);
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

  const handleEditWish = async (wish_id: string) => {
    const wish = creatorWishes?.filter((x) => x.wish_id === wish_id);
    setWishToEdit(wish[0]);
    setEditingWishId(null);
  };

  const handleDeleteWish = async (wish_id: string) => {
    try {
      await onRemoveWish(wish_id);
      setRefresh(true);
    } catch (error: any) {
      if (error?.response) {
        alert("Something went wrong, please try again.");
      }
    } finally {
      setEditingWishId(null);
    }
  };

  return (
    <>
      {isLoaded ? (
        <Loader />
      ) : creatorWishes && creatorWishes.length > 0 ? (
        creatorWishes?.map((x) => (
          <div key={x.wish_id} className='theWishDiv'>
            <img
              src={x.wish_image as string}
              alt='wishImag'
              className='wishImag'
            />
            <div className='wishDetails'>
              <div>
                <h4 className='wishTitle'>{x.wish_name}</h4>
                <p className='wishPrice'>${x.wish_price}</p>
              </div>
              <div
                className='wishOptionBtn'
                onClick={() => setEditingWishId(x.wish_id)}>
                <HiDotsVertical className='wishOptionBtnIcon' />
              </div>
            </div>
            <button className='addToCartBtn'>
              <FaCartPlus className='addToCartBtnIcon' />
              Add To Cart
            </button>
            {editingWishId === x.wish_id && (
              <div className='editingDiv'>
                <RiCloseLine
                  className='closeEditDiv'
                  onClick={() => setEditingWishId(null)}
                />
                <p onClick={() => handleEditWish(x.wish_id)}>
                  <TbEdit
                    style={{
                      color: "green",
                    }}
                  />{" "}
                  Edit wish
                </p>
                <p onClick={() => handleDeleteWish(x.wish_id)}>
                  <MdDeleteForever
                    style={{
                      color: "red",
                    }}
                  />{" "}
                  Delete wish
                </p>
              </div>
            )}
          </div>
        ))
      ) : (
        <h3>Please Add Your Wishes!</h3>
      )}
      {wishToEdit && (
        <EditWish wishToEdit={wishToEdit} setWishToEdit={setWishToEdit} />
      )}
    </>
  );
};

export default TheWish;
