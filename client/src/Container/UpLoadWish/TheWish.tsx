import React, { useState } from "react";
import "./upLoadWish.css";

import { onRemoveWish } from "../../API/authApi";

//Icons
import { FaCartPlus } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { TbEdit } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import { RiCloseLine } from "react-icons/ri";

//Images
import Add from "../../Assets/add.png";

//Context
import { useCreatorData } from "../../Context/CreatorDataProvider";

//Components
import FormatMoney from "../../utils/FormatMoney";
import EditWish from "./EditWish";

//Types
import { iCart } from "../../Types/wishListTypes";
import { iCreatorDataProvider } from "../../Types/creatorStuffTypes";

const TheWish = (): JSX.Element => {
  const [editingWishId, setEditingWishId] = useState<null | string>(null);
  const [wishToEdit, setWishToEdit] = useState<iCart | null>(null);

  let { creatorWishes, filteredAndSortedWishes, setRefreshCreatorData } =
    useCreatorData() as iCreatorDataProvider;

  const handleEditWish = async (wish_id: string) => {
    const wish = creatorWishes?.filter((x) => x.wish_id === wish_id);
    if (wish && wish.length > 0) {
      setWishToEdit(wish[0]);
      setEditingWishId(null);
    }
  };

  const handleDeleteWish = async (wish_id: string) => {
    try {
      await onRemoveWish(wish_id);
      setRefreshCreatorData(true);
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
      {filteredAndSortedWishes && filteredAndSortedWishes.length > 0 ? (
        filteredAndSortedWishes?.map((x) => (
          <div key={x.wish_id} className='theWishDiv'>
            <img
              src={x.wish_image as string}
              alt='wishImag'
              className='wishImag'
            />
            <div className='wishDetails'>
              <div>
                <p className='_popUpWishName'>{x.wish_name}</p>
                <p className='_popUpPrice wishPrice'>
                  <FormatMoney price={Number(x.wish_price)} />
                </p>
              </div>
              <div
                className='wishOptionBtn'
                onClick={() => setEditingWishId(x.wish_id)}>
                <HiDotsVertical className='wishOptionBtnIcon' />
              </div>
            </div>

            {editingWishId === x.wish_id && (
              <div className='relativeWrapper'>
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
              </div>
            )}

            <button className='addToCartBtn'>
              <FaCartPlus className='addToCartBtnIcon' />
              Add To Cart
            </button>
          </div>
        ))
      ) : (
        <div className='_add_wish_container'>
          <img src={Add} alt='add_wish_image' className='_add_img' />
          <h3>Please Add Your Wishes!</h3>
        </div>
      )}
      {wishToEdit && (
        <EditWish wishToEdit={wishToEdit} setWishToEdit={setWishToEdit} />
      )}
    </>
  );
};

export default TheWish;
