import React from "react";
import "./Hero.css";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/authCntextProvider";
import { iAuth } from "../../Types/creatorSocialLinksTypes";

const Index = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { username } = auth as iAuth;

  const handleGetStarted = () => {
    username ? navigate(`/edit-profile/${username}`) : navigate(`/signUp`);
  };

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
        <button onClick={handleGetStarted}>Get Started</button>
      </div>
    </section>
  );
};

export default Index;
