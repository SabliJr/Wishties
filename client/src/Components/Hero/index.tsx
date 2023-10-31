import React from "react";
import "./Hero.css";

import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <section className='hero'>
      <h2>
        Your fan's <span>wish links</span> and your <span>wishlist </span>
        all in one place.
      </h2>
      <p>
        Craft a secure wishlist and link in bio effortlessly in one hub. Making
        support a breeze, while keeping your privacy protected.{" "}
        <span>All for free.</span>
      </p>
      <div className='emailDiv'>
        <button onClick={() => navigate("/wishlist")}>
          Get Started For Free
        </button>
      </div>
    </section>
  );
};

export default Index;
