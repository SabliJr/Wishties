import React from "react";
import "./footer.css";

import FooterLogo from "../../Assets/xLogo.png";
import { useNavigate } from "react-router-dom";

import { BsInstagram } from "react-icons/bs";
import { RiTwitterXLine } from "react-icons/ri";
import { GrLinkedinOption } from "react-icons/gr";

const Index = () => {
  const laDate = new Date().getFullYear();
  let navigate = useNavigate();

  return (
    <footer className='Footer'>
      <main className='footerMain'>
        <div className='logoAndSM'>
          <img src={FooterLogo} alt='' className='footerLogo' />
          <div className='SocialIcons'>
            <a
              href='https://www.instagram.com/wishties_/'
              target='_blank'
              rel='noopener noreferrer'>
              <BsInstagram />
            </a>
            <a
              href='https://twitter.com/wishties_'
              target='_blank'
              rel='noopener noreferrer'>
              <RiTwitterXLine />
            </a>
            <a
              href='https://www.linkedin.com/in/wishties/'
              target='_blank'
              rel='noopener noreferrer'>
              <GrLinkedinOption />
            </a>
          </div>
        </div>
        <div className='footerLinks'>
          <div>
            <h3>Legal</h3>
            <p onClick={() => navigate("/terms-of-service")}>
              Terms of Service
            </p>
            <p onClick={() => navigate("/privacy-policy")}> Privacy Policy</p>
          </div>
          <div>
            <h3>Help</h3>
            <p onClick={() => navigate("/help")}>FAQ & Help</p>
            <p onClick={() => navigate("/how-it-works")}>How it Works</p>
          </div>
          <div>
            <h3>General</h3>
            <p onClick={() => navigate("/contact")}>Contact</p>
          </div>
        </div>
      </main>
      <div className='copy'>
        <p>Wishties &copy;{laDate}</p>
      </div>
    </footer>
  );
};

export default Index;
