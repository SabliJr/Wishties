import React, { useState } from "react";
import "./Header.css";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/authCntextProvider";
import { iAuth } from "../../Types/creatorSocialLinksTypes";
import UserHeader from "../../Container/TheHeader/index";

import Logo from "../../Assets/xLogo.png";
import { RiMenu4Line } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleTrigger = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  const { auth } = useAuth();
  const { username } = auth as iAuth;

  const handleCreateWishlist = () => {
    username ? navigate(`/edit-profile/${username}`) : navigate(`/signUp`);
  };

  return (
    <>
      {username ? (
        <header className='Header'>
          <UserHeader />
        </header>
      ) : (
        <header className='Header'>
          <Link to='/'>
            <img src={Logo} alt='' className='logo' />
          </Link>

          <div className='_cart_menu_div'>
            <Link to='' className='_cart'>
              <FiShoppingCart />
            </Link>
            <div className={`navStuff ${isOpen ? "navStaff expand" : ""}`}>
              <div className='navButtons'>
                <nav className='_nav'>
                  <Link to=''>
                    <li className='_faq'>FAQ</li>
                  </Link>

                  <li>
                    <Link to='/login'>Login</Link>
                  </li>
                  <button onClick={handleCreateWishlist}>
                    {" "}
                    Create Wishlist
                  </button>
                </nav>
              </div>
            </div>
            <RiMenu4Line className='menuIcon' onClick={handleTrigger} />
          </div>
        </header>
      )}
    </>
  );
};

export default Index;
