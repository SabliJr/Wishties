import React from "react";
import "./Hero.css";

const Index = () => {
  return (
    <section className='hero'>
      <h2>
        Your fan's <span>wish links</span> and your <span>wishlist </span>
        all in one place.
      </h2>
      <p>
        Craft a secure wishlist and link in bio effortlessly in one hub. Keeping
        your privacy protected while making support a breeze.
      </p>
      <div className='emailDiv'>
        <input type='email' placeholder='Email' />
        <button>Get early access</button>
      </div>
    </section>
  );
};

export default Index;
