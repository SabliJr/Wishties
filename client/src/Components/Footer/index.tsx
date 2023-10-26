import React from "react";
import "./footer.css";

import FooterLogo from "../../Assets/xLogo.png";

import { BsInstagram } from "react-icons/bs";
import { RiTwitterXLine } from "react-icons/ri";
import { GrLinkedinOption } from "react-icons/gr";

const Index = () => {
  const laDate = new Date().getFullYear();

  return (
    <footer className='Footer'>
      <main className='footerMain'>
        <div className='logoAndSM'>
          <img src={FooterLogo} alt='' className='footerLogo' />
          <div className='SocialIcons'>
            <BsInstagram />
            <RiTwitterXLine />
            <GrLinkedinOption />
          </div>
        </div>
        <div className='footerLinks'>
          <div>
            <h3>Legal</h3>
            <p>Terms of Service</p>
            <p> Privacy Policy</p>
            <p>About</p>
          </div>
          <div>
            <h3>Help</h3>
            <p>FAQ & Help</p>
            <p>How it Works</p>
            <p>Contact</p>
          </div>
          <div>
            <h3>General</h3>
            <p>LogIn</p>
            <p>Links</p>
            <p>WishList</p>
          </div>
        </div>
      </main>
      <div className='copy'>WishLinks &copy;{laDate}</div>
    </footer>
  );
};

export default Index;
