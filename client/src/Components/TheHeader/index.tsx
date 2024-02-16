import React, { useState, useContext } from "react";
import "./Header.css";

import { Link, useNavigate } from "react-router-dom";

import Logo from "../../Assets/xLogo.png";
import { RiMenu4Line } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues } from "../../Types/globalVariablesTypes";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleTrigger = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { cartItems } = contextValues as iGlobalValues;

  return (
    <header className='Header'>
      <Link to='/'>
        <img src={Logo} alt='' className='logo' />
      </Link>

      <div className='_cart_menu_div'>
        <div className='userDiv' onClick={() => navigate("/cart")}>
          {cartItems.cart.length > 0 ? (
            <p className='wishItems'>{cartItems.cartTotalQuantity}</p>
          ) : null}
          <FiShoppingCart className='wishIcon _cart' />
        </div>
        <div className={`navStuff ${isOpen ? "navStaff expand" : ""}`}>
          <div className='navButtons'>
            <nav className='_nav'>
              <Link to='/help'>
                <li className='_faq'>FAQ</li>
              </Link>

              <li>
                <Link to='/login' className='_login_text'>
                  Login
                </Link>
              </li>
              <button onClick={() => navigate("/signUp")}>
                Create Wishlist
              </button>
            </nav>
          </div>
        </div>
        <RiMenu4Line className='menuIcon' onClick={handleTrigger} />
      </div>
    </header>
  );
};

export default Index;
