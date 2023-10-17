import React from "react";
import "./promo.css";

import PromoImg from "../../Assets/6492b8667c8c4a9efe0f6f87_Wishlist_Screenshot.jpeg";
import { BiSolidBadgeCheck } from "react-icons/bi";

const Index = () => {
  return (
    <main className='promo'>
      <div>
        <p>
          <BiSolidBadgeCheck /> Get early access
        </p>
        <p>
          <BiSolidBadgeCheck /> Your in safe hands
        </p>
        <p>
          <BiSolidBadgeCheck /> No hidden fees
        </p>
      </div>
      <img src={PromoImg} alt='promImg' className='promImg' />
    </main>
  );
};

export default Index;
