import React, { useContext } from "react";
import "./cart.css";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues, iCart } from "../../Types/creatorSocialLinksTypes";

//Icons
import { BsArrowLeft } from "react-icons/bs";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const Cart = () => {
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { cartItems, setCartItems } = contextValues as iGlobalValues;

  return (
    <main>
      <h1>Shopping Cart</h1>
      {cartItems?.cart.length === 0 ? (
        <div>
          <p>Your Cart is empty</p>
          <button>
            <span>
              <BsArrowLeft />
            </span>{" "}
            Support you favorite creator!
          </button>
        </div>
      ) : (
        <section>
          <div>
            <h5>Wish Basket for "creator_name" @"creator_username"</h5>
            <p>
              You are about to send a payout to "creator_name" to fund their
              wishes.
            </p>
            <p></p>
          </div>
          <div>
            <div>
              <h5>Wish</h5>
              <h5>Price</h5>
              <h5>Quantity</h5>
              <h5>Subtotal</h5>
            </div>
            {cartItems?.cart.map((item: iCart) => (
              <div key={item.wish_id} className='cart-item'>
                <img src={item.wish_image} alt={item.wish_name} />
                <div>
                  <h3>{item.wish_name}</h3>
                </div>
                <div>
                  <button
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

                        return {
                          cart: newCart,
                          cartTotalQuantity: newTotalQuantity,
                          cartTotalAmount: newTotalAmount,
                        };
                      });
                    }}>
                    Remove
                  </button>
                  <h3 className='price'>${item.wish_price}</h3>
                  <div>
                    <button>
                      <AiOutlinePlus />
                    </button>
                    <p>{item.quantity}</p>
                    <button>
                      <AiOutlineMinus />
                    </button>
                  </div>
                  <p>{0}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <button>Clear Cart</button>
            <div>
              <h5>10% Fee: ${0}</h5>
              <h5>Total: ${cartItems?.cartTotalAmount}</h5>
              <button>
                <span>
                  <BsArrowLeft />
                </span>{" "}
                Add More Wish
              </button>
            </div>
          </div>
          <div>
            <p>Add Message:</p>
            <textarea></textarea>
            <input type='text' />
            <input type='Email' />
          </div>

          <div>
            <div>
              <button>
                <input type='checkbox' /> Don't publish
              </button>
            </div>
            <div>
              <button>
                <input type='checkbox' /> I agree to the Terms of Service and
                Privacy Policy and the following statements:
              </button>
              <ol>
                <li>
                  I understand that I am making a non-refundable cash gift
                  donation.
                </li>
                <li>
                  I expect <span>NO</span> product or service in return from the
                  gift recipient.
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
              </ol>
            </div>
            <button>CHECKOUT</button>
          </div>
        </section>
      )}
    </main>
  );
};

export default Cart;
