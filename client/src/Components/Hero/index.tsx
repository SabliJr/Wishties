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
        Stop confusing your fans, make it easier for them to support you! Create
        a wishlist and link in bio in one hub {"  "}
        <span> All for free.</span>
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
