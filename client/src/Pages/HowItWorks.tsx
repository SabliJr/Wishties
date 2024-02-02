import React, { useState } from "react";
import "./Pages.css";

import Skeleton from "../utils/Skeleton";

import LinkImg from "../Assets/link.png";
import PaymentImg from "../Assets/mobile-payment-2-512.png";
import CreateWishlistImg from "../Assets/wishlist2.png";

import WishList1 from "../Assets/wishlist1.png";
import Payment from "../Assets/mobile-banking.png";
import MessageImg from "../Assets/communication.png";
import ShoppingCart from "../Assets/shopping-cart.png";

const HowItWorks = () => {
  const [active, setActive] = useState(true);
  const [whoIsThis, setWhoIsThis] = useState("wisher");

  const handleActive = (e: any) => {
    if (e.target.innerText === "FOR WISHERS") {
      setActive(true);
      setWhoIsThis("wisher");
    } else {
      setActive(false);
      setWhoIsThis("gifter");
    }
  };

  return (
    <Skeleton>
      <div className='_how_it_works_title_div'>
        <button
          onClick={handleActive}
          className={
            active
              ? `_how_it_works_title _how_it_works_active`
              : `_how_it_works_title`
          }>
          FOR WISHERS
        </button>
        <button
          onClick={handleActive}
          className={
            active
              ? `_how_it_works_title`
              : `_how_it_works_title _how_it_works_active`
          }>
          FOR GIFTERS
        </button>
      </div>
      {whoIsThis === "wisher" ? (
        <main className='_how_it_works_container'>
          <div className='_how_it_works_div'>
            <div className='_how_it_works_txt_div'>
              <h3>Step: 1</h3>
              <h4>Create Your Wishlist.</h4>
              <p>
                Add items from any online store or manually add offline wishes.
                With our custom gift entry, you can get creative. List full
                outfits, trips to the spa, shopping sprees, and more.
              </p>
            </div>
            <img
              src={CreateWishlistImg}
              alt='wishlist'
              className='_how_it_works_img _how_it_works_img_f'
            />
          </div>
          <div className='_how_it_works_div'>
            <div className='_how_it_works_txt_div'>
              <h3>Step: 2</h3>
              <h4>Set up your payments.</h4>
              <p>
                Using our secure established third party payment processor, set
                up your payments. This information is never seen by your gifter.
              </p>
            </div>
            <img
              src={PaymentImg}
              alt='mobile payment'
              className='_how_it_works_img _how_it_works_img_s'
            />
          </div>
          <div className='_how_it_works_div'>
            <div className='_how_it_works_txt_div'>
              <h3>Step: 3</h3>
              <h4>Add your link to your Twitter/Linktree/Other.</h4>
              <p>
                Share your wishlist link with your fans. When a fan purchases an
                item off your wishlist, you get the cash to purchase the item.
                You can send a picture 'thank you' note within the app.
              </p>
            </div>
            <img src={LinkImg} alt='link img' className='_how_it_works_img' />
          </div>
        </main>
      ) : whoIsThis === "gifter" ? (
        <main className='_how_it_works_container'>
          <div className='_how_it_works_div'>
            <div className='_how_it_works_txt_div'>
              <h3>Step: 1</h3>
              <h4>Visit A Wishlist.</h4>
              <p>
                Browse your favorite creator's wishes on their wishlist. From
                items, to outing, to treats, you can see everything your creator
                wishes for and add them to your gift basket.
              </p>
            </div>
            <img
              src={WishList1}
              alt='wishlist'
              className='_how_it_works_img _how_it_works_img_f'
            />
          </div>
          <div className='_how_it_works_div'>
            <div className='_how_it_works_txt_div'>
              <h3>Step: 2</h3>
              <h4>Create a Gift Basket.</h4>
              <p>Pick one or more items to add to your gift basket</p>
            </div>
            <img
              src={ShoppingCart}
              alt='mobile payment'
              className='_how_it_works_img'
            />
          </div>
          <div className='_how_it_works_div'>
            <div className='_how_it_works_txt_div'>
              <h3>Step: 3</h3>
              <h4>Leave a message.</h4>
              <p>
                You can choose to leave a message and a pseudonym. Your email
                will be kept hidden, but we will relay any picture messages from
                the creator to this email.
              </p>
            </div>
            <img
              src={MessageImg}
              alt='link img'
              className='_how_it_works_img 
            _how_it_works_img_m
          '
            />
          </div>
          <div className='_how_it_works_div'>
            <div className='_how_it_works_txt_div'>
              <h3>Step: 3</h3>
              <h4>Fund the Gift Basket.</h4>
              <p>
                Finish by checking out with our secure and established third
                party payment processor. All your private information will
                remain hidden from your wisher.
              </p>
            </div>
            <img src={Payment} alt='link img' className='_how_it_works_img' />
          </div>
        </main>
      ) : null}
    </Skeleton>
  );
};

export default HowItWorks;
