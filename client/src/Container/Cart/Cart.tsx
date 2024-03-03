import React, { useContext, useEffect, useState } from "react";
import "./cart.css";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues } from "../../Types/globalVariablesTypes";
import {
  iCart,
  iPurchaseDetails,
  iSurpriseGift,
} from "../../Types/wishListTypes";
import { useNavigate } from "react-router-dom";

//Icons
import { BsArrowLeft } from "react-icons/bs";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { AiFillQuestionCircle } from "react-icons/ai";
import { loadStripe } from "@stripe/stripe-js";

import FormatMoney from "../../utils/FormatMoney";
import { onGetCreatorForCart, onCheckOut } from "../../API/authApi";
import Loader from "../../utils/Loader";

// Load Stripe with your public key
const stripePromise = loadStripe(
  process.env.NODE_ENV === "production"
    ? (process.env.STRIPE_LIVE_PUBLIC_KEY as string)
    : (process.env.STRIPE_TEST_PUBLIC_KEY as string)
);

const Cart = () => {
  const [remainingChars, setRemainingChars] = useState(256);
  const [creator_name, setCreatorName] = useState({
    creator_name: "",
    username: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState<iPurchaseDetails>({
    message: "",
    simp_name: "",
    fan_email: "",
    is_to_publish: false,
    cart: [],
    surpriseGift: [],
  });

  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { cartItems, setCartItems } = contextValues as iGlobalValues;

  let navigate = useNavigate();
  let creator_id =
    cartItems?.cart.length !== 0
      ? cartItems?.cart?.map((x: iCart) => x.creator_id)
      : cartItems?.surpriseGift?.map((x: iSurpriseGift) => x.creator_id);

  useEffect(() => {
    (async () => {
      try {
        const creator_info = await onGetCreatorForCart(
          creator_id?.[0] as string
        );
        if (creator_info.status === 200) {
          setCreatorName((prev) => {
            return {
              ...prev,
              creator_name: creator_info?.data?.creator.creator_name,
              username: creator_info?.data?.creator.username,
            };
          });
        }
      } catch (error) {
        // alert("An error occurred. Please refresh the page.");
      }
    })();
  }, []);

  const handleIncreaseQuantity = (wish_id: string) => {
    const newCart = cartItems?.cart.map((x: iCart) =>
      x.wish_id === wish_id
        ? {
            ...x,
            quantity: (x.quantity as number) + 1,
          }
        : x
    );

    const newTotal = newCart?.reduce(
      (sum, item) => sum + Number(item.wish_price) * (item.quantity as number),
      0
    );

    const newTotalQuantity = newCart?.reduce(
      (sum, item) => sum + (item.quantity as number),
      0
    );

    const cartNewItems = {
      ...cartItems,
      cart: newCart,
      cartTotalAmount: newTotal,
      cartTotalQuantity: newTotalQuantity,
    };

    setCartItems(cartNewItems);

    localStorage.setItem("cart_items", JSON.stringify(newCart));
    localStorage.setItem("cart_total_amount", JSON.stringify(newTotal));
    localStorage.setItem(
      "cart_total_quantity",
      JSON.stringify(newTotalQuantity)
    );
  };

  const handleDecreaseQuantity = (wish_id: string) => {
    const newCart = cartItems?.cart
      .map((x: iCart) =>
        x.wish_id === wish_id
          ? { ...x, quantity: (x.quantity as number) - 1 }
          : x
      )
      .filter((x: iCart) => (x.quantity as number) > 0);

    const newTotal = newCart?.reduce(
      (sum, item) => sum + Number(item.wish_price) * (item.quantity as number),
      0
    );

    const newTotalQuantity = newCart?.reduce(
      (sum, item) => sum + (item.quantity as number),
      0
    );

    const cartNewItems = {
      ...cartItems,
      cart: newCart,
      cartTotalAmount: newTotal,
      cartTotalQuantity: newTotalQuantity,
    };
    setCartItems(cartNewItems);

    localStorage.setItem("cart_items", JSON.stringify(newCart));
    localStorage.setItem("cart_total_amount", JSON.stringify(newTotal));
    localStorage.setItem(
      "cart_total_quantity",
      JSON.stringify(newTotalQuantity)
    );
  };

  const handleCheckout = async () => {
    if (!agreeTerms) {
      alert("Please agree to the terms and policy to proceed.");
      return;
    }

    if (purchaseDetails.fan_email === "") {
      alert("Please provide your email to proceed.");
      return;
    }

    try {
      setIsLoaded(true);

      const response = await onCheckOut(purchaseDetails as iPurchaseDetails);
      console.log(response);
      if (response.status === 200) {
        console.log(response.status);
        redirectToCheckout(response.data.session_id);
      }
    } catch (error: any) {
      if (error) {
        alert("An error occurred. Please try again.");
        setIsLoaded(false);
      }
    }
  };

  // Later, when you want to redirect to checkout
  const redirectToCheckout = async (sessionId: string) => {
    const stripe = await stripePromise;
    const result = await stripe?.redirectToCheckout({
      sessionId,
    });

    // Handle any errors
    if (result && result.error) {
      alert("An error occurred. Please try again.");
      setIsLoaded(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const remaining = 256 - text.length;
    setRemainingChars(remaining);
    setPurchaseDetails((prev) => {
      return {
        ...prev,
        message: text,
      };
    });
  };

  // Update state when cartItems changes
  useEffect(() => {
    setPurchaseDetails((prev) => {
      return {
        ...prev,
        cart: cartItems?.cart,
        surpriseGift: cartItems?.surpriseGift as iSurpriseGift[],
      };
    });
  }, [cartItems]); // Dependency array

  return (
    <>
      {isLoaded && <Loader />}
      <main className='_cart_container'>
        <h2
          style={
            cartItems?.cart.length === 0 &&
            cartItems?.surpriseGift?.length === 0
              ? { textAlign: "center" }
              : {
                  textAlign: "left",
                }
          }>
          Wishes Shopping.
        </h2>
        {cartItems?.cart.length === 0 &&
        cartItems?.surpriseGift?.length === 0 ? (
          <p className='_empty_cart'>Your Cart is empty!</p>
        ) : (
          <section>
            <div className='_cart_titles'>
              <h5>
                Wish Basket for{" "}
                <span className='_cart_username'>@{creator_name.username}</span>
              </h5>
              <p>
                You are about to send a payout to {creator_name.creator_name} to
                fund their wishes.
              </p>
              <p></p>
            </div>
            <div>
              <div className='_cart_wish_sections'>
                <p>Wishes</p>
                <p>Quantity</p>
                <p>Subtotal</p>
              </div>
              {cartItems?.cart.map((item: iCart) => (
                <div key={item.wish_id} className='_cart_item'>
                  <div className='_wish_rapper'>
                    <img
                      src={item.wish_image as string}
                      alt={item.wish_name}
                      className='_cart_wish_img'
                    />
                    <div className='_cart_wish_details'>
                      <span>
                        <p className='_cart_wish_name'>{item.wish_name}</p>
                        <p className='price _cart_wish_price'>
                          <FormatMoney price={item.wish_price as number} />
                        </p>
                      </span>

                      <button
                        className='_cart_remove_btn'
                        onClick={() => {
                          setCartItems?.((prev) => {
                            let surpriseGift = prev?.surpriseGift;
                            const newCart = prev?.cart.filter(
                              (x: iCart) => x.wish_id !== item.wish_id
                            );

                            const newTotalQuantity =
                              newCart.length + (surpriseGift?.length || 0);

                            const newTotalAmount =
                              newCart.reduce(
                                (total, item) =>
                                  total + Number(item.wish_price),
                                0
                              ) +
                              (prev?.surpriseGift || []).reduce(
                                (total, item) => total + Number(item.amount),
                                0
                              );

                            localStorage.setItem(
                              "cart_items",
                              JSON.stringify(newCart)
                            );
                            localStorage.setItem(
                              "cart_total_amount",
                              JSON.stringify(newTotalAmount)
                            );
                            localStorage.setItem(
                              "cart_total_quantity",
                              JSON.stringify(newTotalQuantity)
                            );

                            return {
                              cart: newCart,
                              cartTotalQuantity: newTotalQuantity,
                              cartTotalAmount: newTotalAmount,
                              surpriseGift: surpriseGift,
                            };
                          });
                        }}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className='_cart_qnty_btns'>
                    <button
                      className='_cart_qnty_btn'
                      onClick={() => handleDecreaseQuantity(item.wish_id)}>
                      <AiOutlineMinus />
                    </button>
                    <p>{item.quantity}</p>
                    <button
                      className='_cart_qnty_btn'
                      onClick={() => handleIncreaseQuantity(item.wish_id)}>
                      <AiOutlinePlus />
                    </button>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p className='_cart_subtotal'>
                      <FormatMoney
                        price={
                          (item.quantity as number) * Number(item.wish_price)
                        }
                      />
                    </p>
                  </div>
                </div>
              ))}
              {cartItems?.surpriseGift?.map((item: iSurpriseGift) => (
                <div key={item.creator_id} className='_cart_item'>
                  <div className='_wish_rapper'>
                    <img
                      src={item.image as string}
                      alt='Surprise Gift'
                      className='_cart_wish_img'
                    />
                    <div className='_cart_wish_details'>
                      <span>
                        <p>Surprise Gift</p>
                        <p className='_cart_wish_name'>{item.suggestedUse}</p>
                        <p className='price _cart_wish_price'>
                          <FormatMoney price={item.amount as number} />
                        </p>
                      </span>
                      <button
                        className='_cart_remove_btn'
                        onClick={() => {
                          setCartItems?.((prev) => {
                            let cart = prev?.cart;
                            const newCart = prev?.surpriseGift?.filter(
                              (x: iSurpriseGift) =>
                                x.creator_id !== item.creator_id
                            );

                            const newTotalAmount =
                              (newCart || [])?.reduce(
                                (total, item) => total + Number(item.amount),
                                0
                              ) +
                              (cart?.reduce(
                                (total, item) =>
                                  total + Number(item.wish_price),
                                0
                              ) || 0);

                            const newTotalQuantity =
                              (newCart?.length || 0) + cartItems?.cart?.length;

                            localStorage.setItem(
                              "surprise_gift",
                              JSON.stringify(newCart)
                            );

                            localStorage.setItem(
                              "cart_total_amount",
                              JSON.stringify(newTotalAmount)
                            );

                            localStorage.setItem(
                              "cart_total_quantity",
                              JSON.stringify(newTotalQuantity)
                            );

                            return {
                              cart: cart,
                              surpriseGift: newCart,
                              cartTotalQuantity: newTotalQuantity,
                              cartTotalAmount:
                                (newTotalAmount || 0) +
                                (cartItems?.cartTotalAmount || 0),
                            };
                          });
                        }}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div>
                    <p>-</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p className='_cart_subtotal'>
                      <FormatMoney price={Number(item.amount)} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className='_cart_bottom_details'>
              <button
                className='_clear_cart_btn'
                onClick={() =>
                  setCartItems(() => {
                    localStorage.removeItem("cart_items");
                    localStorage.removeItem("cart_total_amount");
                    localStorage.removeItem("cart_total_quantity");
                    localStorage.removeItem("surprise_gift");

                    return {
                      cart: [],
                      cartTotalAmount: 0,
                      cartTotalQuantity: 0,
                      surpriseGift: [],
                    };
                  })
                }>
                Clear Cart
              </button>
              <div className='_cart_total_details'>
                <h5>
                  10% Fee:{" "}
                  <FormatMoney price={cartItems.cartTotalAmount * 0.1} />
                </h5>
                <h5>
                  Total:{" "}
                  <FormatMoney
                    price={
                      cartItems?.cartTotalAmount +
                      cartItems.cartTotalAmount * 0.1
                    }
                  />
                </h5>
                <button
                  className='_add_more_wishes_btn'
                  onClick={() => navigate(`/${creator_name.username}`)}>
                  <BsArrowLeft />
                  Add More Wishes
                </button>
              </div>
            </div>
            <div className='_cart_fan_info'>
              <div className='_msg_div'>
                <p className='_add_message'>Add Message:</p>
                <textarea
                  name='message'
                  className='_cart_message'
                  id='message'
                  cols={30}
                  rows={10}
                  placeholder='Type your message here...'
                  maxLength={257}
                  onChange={handleTextChange}
                />
                <p className='_cart_message_notice'>
                  This size gift allows you 256 characters.{" "}
                  <span className='_msg_count'>{remainingChars}</span>{" "}
                  remaining.
                </p>
              </div>
              <div className='_cart_inputs_div'>
                <div className='form__div'>
                  <input
                    type='text'
                    className='form__input'
                    placeholder=' '
                    onChange={(e) =>
                      setPurchaseDetails((prev) => {
                        return {
                          ...prev,
                          simp_name: e.target.value,
                        };
                      })
                    }
                  />
                  <label htmlFor='' className='form__label'>
                    From:
                  </label>
                  <span className='_fan_name_notice'>
                    <AiFillQuestionCircle />
                  </span>
                  <p className='_name_notice_msg'>
                    Visible to {creator_name.creator_name}
                  </p>
                </div>

                <div className='form__div'>
                  <input
                    type='email'
                    className='form__input'
                    placeholder=' '
                    required
                    onChange={(e) => {
                      setPurchaseDetails((prev) => {
                        return {
                          ...prev,
                          fan_email: e.target.value,
                        };
                      });
                    }}
                  />
                  <label htmlFor='' className='form__label'>
                    Email*: private
                  </label>
                  <span className='_fan_email_notice'>
                    <AiFillQuestionCircle />
                  </span>
                  <p className='_email_notice_msg'>
                    Your email is private and will not be seen by{" "}
                    {creator_name.creator_name}. Receipts and messages from{" "}
                    {creator_name.creator_name} will be relayed to this email.
                  </p>
                </div>
              </div>
            </div>

            <div className='_cart_terms_div'>
              <div>
                <p className='_cart_publish_btn'>
                  <input
                    type='checkbox'
                    className='_cart_publish_checkbox'
                    onChange={(e) =>
                      setPurchaseDetails((prev) => {
                        return {
                          ...prev,
                          is_to_publish: e.target.checked,
                        };
                      })
                    }
                  />{" "}
                  Don't publish
                </p>
                <p className='_publishing_notice'>
                  If checked, your wisher will not be able to publish your
                  message and pseudonym you provided above to their wishlist.
                  Regardless of whether you check this or not, your email and
                  personal information will always be private.
                </p>
              </div>
              <div>
                <p className='_cart_terms_policy'>
                  <input
                    type='checkbox'
                    className='_cart_terms_policy_checkbox'
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />{" "}
                  I agree to the{" "}
                  <span
                    className='_terms_policy_span'
                    onClick={() => navigate("/terms-of-service")}>
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span
                    className='_terms_policy_span'
                    onClick={() => navigate("/privacy-policy")}>
                    Privacy Policy
                  </span>
                  and the following statements:
                </p>
                <ul className='_cart_terms'>
                  <li>
                    I understand that I am making a non-refundable cash gift
                    donation.
                  </li>
                  <li>
                    I expect <span className='_cart_no'>NO</span> product or
                    service in return from the gift recipient.
                  </li>
                  <li>
                    This payment is a donation intended for the gift recipient.
                  </li>
                  <li>
                    I have taken the necessary steps to confirm the wishlist
                    owner is authentic and I understand that Wishties will not
                    be held responsible for any issues arising from a catfishing
                    situation.
                  </li>
                  <li>
                    I understand that by violating these terms I may be subject
                    to legal action or can fall a victim of scams.
                  </li>
                  <li>
                    I understand that by checking the box above and then
                    clicking "CHECKOUT", I will have created a legally binding
                    e-signature to this agreement.
                  </li>
                </ul>
              </div>
            </div>
            <div className='_checkout_btn_div' onClick={handleCheckout}>
              <button className='_checkout_btn'>CHECKOUT</button>
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default Cart;
