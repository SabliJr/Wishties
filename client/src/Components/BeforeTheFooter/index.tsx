import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/authCntextProvider";
import { iAuth } from "../../Types/creatorSocialLinksTypes";

import "./bFooter.css";
import "../Hero/Hero.css";

import Img1 from "../../Assets/pexels-marcela-oliveira-3207694.jpg";
import Img2 from "../../Assets/pexels-michelle-leman-6774998.jpg";
import Img3 from "../../Assets/aiony-haust-3TLl_97HNJo-unsplash.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { username } = auth as iAuth;

  const handleGetStarted = () => {
    username ? navigate(`/edit-profile/${username}`) : navigate(`/login`);
  };

  return (
    <section className='bFooter'>
      <h3 className='why'>At Wishties</h3>
      <p className='whyText'>
        We believe in the magic of connection and the power of wishes. We're the
        platform where your dreams come to life, your fan’s desires are
        fulfilled, and communities grow stronger through connections.
      </p>
      <div className='emailDivDown'>
        <button onClick={handleGetStarted}>Get Started For Free</button>
      </div>
      <article className='imagesArticle'>
        <div className='cusImgDiv'>
          <img src={Img1} alt='' className='cusImg' />
          <img src={Img2} alt='' className='cusImg' />
          <img src={Img3} alt='' className='cusImg' />
        </div>
        <div className='arrowAndText'>
          <p>
            Join over <span>+1K</span> creators who are Wishties daily.
          </p>
        </div>
      </article>
    </section>
  );
};

export default Index;
