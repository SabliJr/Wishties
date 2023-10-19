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
        Craft a secure wishlist and link in bio effortlessly in one hub. Making
        support a breeze, while keeping your privacy protected.
      </p>
      <div className='emailDiv'>
        <input type='email' placeholder='Email' />
        <button>Join the waitlist</button>
      </div>
    </section>
  );
};

export default Index;
