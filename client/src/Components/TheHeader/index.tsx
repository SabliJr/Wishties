import React, { useState, useContext } from "react";
import "./Header.css";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/authCntextProvider";
import { iAuth } from "../../Types/creatorSocialLinksTypes";
import UserHeader from "../../Container/TheHeader/index";

import Logo from "../../Assets/xLogo.png";
import { RiMenu4Line } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues } from "../../Types/creatorSocialLinksTypes";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleTrigger = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  const { auth } = useAuth();
  const { username } = auth as iAuth;

  const handleCreateWishlist = () => {
    username ? navigate(`/edit-profile/${username}`) : navigate(`/signUp`);
  };

  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { cartItems } = contextValues as iGlobalValues;

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
            <div className='userDiv' onClick={() => navigate("/cart")}>
              <p className='wishItems'>{cartItems.cartTotalQuantity}</p>
              <FiShoppingCart className='wishIcon _cart' />
            </div>
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
