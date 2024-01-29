import React, { useEffect, useState, useContext } from "react";
import "./upLoadWish.css";
import "../Public/creator_page_style.css";

import { onRemoveWish } from "../../API/authApi";

//Icons
import { FaCartPlus } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { TbEdit } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import { RiCloseLine } from "react-icons/ri";
import { GrClose } from "react-icons/gr";

//Context
import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues } from "../../Types/globalVariablesTypes";

//Components
import FormatMoney from "../../utils/FormatMoney";
import EditWish from "./EditWish";

import { useLocation, useNavigate } from "react-router-dom";

//Types
import { iLocalUser } from "../../Types/creatorStuffTypes";
import { iCart } from "../../Types/wishListTypes";

const TheWish = (): JSX.Element => {
  const [editingWishId, setEditingWishId] = useState<null | string>(null);
  const [wishToEdit, setWishToEdit] = useState<iCart | null>(null);
  const [user_info, setUser_info] = useState<null | iLocalUser>(null);
  const [addingToCartItemId, setAddingToCartItemId] = useState<null | string>(
    null
  );
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const {
    creatorWishes,
    setRefetchCreatorData,
    setCartItems,
    filteredAndSortedWishes,
    showProfile,
  } = contextValues as iGlobalValues;

  let { pathname } = useLocation();
  let navigate = useNavigate();
  useEffect(() => {
    let role = localStorage.getItem("user_info");
    if (role) setUser_info(JSON.parse(role));
    else setUser_info(null);
  }, [pathname]);

  const handleEditWish = async (wish_id: string) => {
    const wish = creatorWishes?.filter((x) => x.wish_id === wish_id);
    setWishToEdit(wish[0]);
    setEditingWishId(null);
  };

  const handleDeleteWish = async (wish_id: string) => {
    try {
      await onRemoveWish(wish_id);
      setRefetchCreatorData(true);
    } catch (error: any) {
      if (error?.response) {
        alert("Something went wrong, please try again.");
      }
    } finally {
      setEditingWishId(null);
    }
  };

  const handleAddToCart = (wish: iCart) => {
    setCartItems((prevCartItems) => {
      let cart = [...prevCartItems.cart];
      let wishInCart = cart.find(
        (item: iCart) => item.wish_id === wish.wish_id
      );

      if (wishInCart) {
        if (wishInCart.quantity) wishInCart.quantity++;
      } else {
        wish.quantity = 1;
        cart.push(wish);
      }

      const cartTotalQuantity = cart.reduce(
        (total, item) => total + (item.quantity as number),
        0
      );
      const cartTotalAmount = cart.reduce(
        (total, item) =>
          total + (item.wish_price as number) * (item?.quantity as number),
        0
      );

      localStorage.setItem("cart_items", JSON.stringify(cart));
      localStorage.setItem(
        "cart_total_quantity",
        JSON.stringify(cartTotalQuantity)
      );
      localStorage.setItem(
        "cart_total_amount",
        JSON.stringify(cartTotalAmount)
      );

      return {
        ...prevCartItems,
        cart,
        cartTotalQuantity,
        cartTotalAmount,
      };
    });
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
              {user_info?.role === "creator" && !showProfile ? (
                <div
                  className='wishOptionBtn'
                  onClick={() => setEditingWishId(x.wish_id)}>
                  <HiDotsVertical className='wishOptionBtnIcon' />
                </div>
              ) : null}
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

            <button
              className='addToCartBtn'
              onClick={() => setAddingToCartItemId(x.wish_id)}>
              <FaCartPlus className='addToCartBtnIcon' />
              Add To Cart
            </button>
            {addingToCartItemId === x.wish_id && (
              <>
                <div className='dropBack'></div>
                <div className='wishPopUp'>
                  <span
                    className='_popUpCloseIcon'
                    onClick={() => setAddingToCartItemId(null)}>
                    <GrClose />
                  </span>
                  <img
                    src={x.wish_image as string}
                    alt='wish_image'
                    className='_popUpImg'
                  />
                  <p className='_popUpWishName'>{x?.wish_name}</p>
                  <p className='_popUpPrice'>${x.wish_price}</p>
                  <div className='popUpBtns'>
                    <button
                      onClick={() => {
                        setAddingToCartItemId(null);
                        handleAddToCart(x);
                      }}>
                      Add To Cart & Keep Shopping
                    </button>
                    <button
                      onClick={() => {
                        setAddingToCartItemId(null);
                        handleAddToCart(x);
                        navigate("/cart");
                      }}>
                      Add To Cart & Checkout
                    </button>
                  </div>
                </div>
              </>
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
