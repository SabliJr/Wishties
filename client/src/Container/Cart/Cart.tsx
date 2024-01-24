import React, { useContext, useState } from "react";
import "./cart.css";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues, iCart } from "../../Types/creatorSocialLinksTypes";
import { useNavigate } from "react-router-dom";

//Icons
import { BsArrowLeft } from "react-icons/bs";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { AiFillQuestionCircle } from "react-icons/ai";

import FormatMoney from "../../utils/FormatMoney";

const Cart = () => {
  const [remainingChars, setRemainingChars] = useState(256);

  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { cartItems, setCartItems } = contextValues as iGlobalValues;
  let navigate = useNavigate();

  const handleIncreaseQuantity = (wish_id: string) => {
    const newCart = cartItems?.cart.map((x: iCart) =>
      x.wish_id === wish_id
        ? {
            ...x,
            quantity: x.quantity + 1,
          }
        : x
    );

    const newTotal = newCart?.reduce(
      (sum, item) => sum + Number(item.wish_price) * item.quantity,
      0
    );

    const newTotalQuantity = newCart?.reduce(
      (sum, item) => sum + item.quantity,
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
        x.wish_id === wish_id ? { ...x, quantity: x.quantity - 1 } : x
      )
      .filter((x: iCart) => x.quantity > 0);

    const newTotal = newCart?.reduce(
      (sum, item) => sum + Number(item.wish_price) * item.quantity,
      0
    );

    const newTotalQuantity = newCart?.reduce(
      (sum, item) => sum + item.quantity,
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
    console.log("Checkout");
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const remaining = 256 - text.length;
    setRemainingChars(remaining);
  };

  return (
    <main className='_cart_container'>
      <h2
        style={
          cartItems?.cart.length === 0
            ? { textAlign: "center" }
            : {
                textAlign: "left",
              }
        }>
        Wishes Shopping.
      </h2>
      {cartItems?.cart.length === 0 ? (
        <p className='_empty_cart'>Your Cart is empty!</p>
      ) : (
        <section>
          <div className='_cart_titles'>
            <h5>
              Wish Basket for "creator_name"{" "}
              <span className='_cart_username'>@"creator_username"</span>
            </h5>
            <p>
              You are about to send a payout to "creator_name" to fund their
              wishes.
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
                    src={item.wish_image}
                    alt={item.wish_name}
                    className='_cart_wish_img'
                  />
                  <div className='_cart_wish_details'>
                    <span>
                      <p className='_cart_wish_name'>{item.wish_name}</p>
                      <p className='price _cart_wish_price'>
                        <FormatMoney price={item.wish_price} />
                      </p>
                    </span>

                    <button
                      className='_cart_remove_btn'
                      onClick={() => {
                        setCartItems?.((prev) => {
                          const newCart = prev?.cart.filter(
                            (x: iCart) => x.wish_id !== item.wish_id
                          );
                          const newTotalQuantity = newCart.length;
                          const newTotalAmount = newCart.reduce(
                            (total, item) => total + Number(item.wish_price),
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
                    onClick={() => handleIncreaseQuantity(item.wish_id)}>
                    <AiOutlinePlus />
                  </button>
                  <p>{item.quantity}</p>
                  <button
                    className='_cart_qnty_btn'
                    onClick={() => handleDecreaseQuantity(item.wish_id)}>
                    <AiOutlineMinus />
                  </button>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p className='_cart_subtotal'>
                    <FormatMoney
                      price={item.quantity * Number(item.wish_price)}
                    />
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className='_cart_bottom_details'>
            <button
              className='_clear_cart_btn'
              onClick={() =>
                setCartItems({
                  cart: [],
                  cartTotalAmount: 0,
                  cartTotalQuantity: 0,
                })
              }>
              Clear Cart
            </button>
            <div className='_cart_total_details'>
              <h5>
                10% Fee: <FormatMoney price={cartItems.cartTotalAmount * 0.1} />
              </h5>
              <h5>
                Total: <FormatMoney price={cartItems?.cartTotalAmount} />
              </h5>
              <button className='_add_more_wishes_btn'>
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
                <span className='_msg_count'>{remainingChars}</span> remaining.
              </p>
            </div>
            <div className='_cart_inputs_div'>
              <div className='form__div'>
                <input type='text' className='form__input' placeholder=' ' />
                <label htmlFor='' className='form__label'>
                  From:
                </label>
                <span className='_fan_name_notice'>
                  <AiFillQuestionCircle />
                </span>
                <p className='_name_notice_msg'>Visible to "@creator_name"</p>
              </div>

              <div className='form__div'>
                <input
                  type='email'
                  className='form__input'
                  placeholder=' '
                  required
                />
                <label htmlFor='' className='form__label'>
                  Email*: private
                </label>
                <span className='_fan_email_notice'>
                  <AiFillQuestionCircle />
                </span>
                <p className='_email_notice_msg'>
                  Your email is private and will not be seen by Sabli Jr.
                  Receipts and messages from Sabli Jr will be relayed to this
                  email.
                </p>
              </div>
            </div>
          </div>

          <div className='_cart_terms_div'>
            <div>
              <p className='_cart_publish_btn'>
                <input type='checkbox' className='_cart_publish_checkbox' />{" "}
                Don't publish
              </p>
              <p className='_publishing_notice'>
                If checked, your wisher will not be able to publish your message
                and pseudonym you provided above to their wishlist. Regardless
                of whether you check this or not, your email and personal
                information will always be private.
              </p>
            </div>
            <div>
              <p className='_cart_terms_policy'>
                <input
                  type='checkbox'
                  className='_cart_terms_policy_checkbox'
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
                  I have taken the necessary steps to confirm the wishlist owner
                  is authentic and I understand that Wishties will not be held
                  responsible for any issues arising from a catfishing
                  situation.
                </li>
                <li>
                  I understand that by violating these terms I may be subject to
                  legal action or can fall a victim of scams.
                </li>
                <li>
                  I understand that by checking the box above and then clicking
                  "CHECKOUT", I will have created a legally binding e-signature
                  to this agreement.
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
  );
};

export default Cart;
