import React, { useState, useRef, useContext } from "react";
import "./wishHeader.css";

import Logo from "../../Assets/xLogo.png";

//Icons
import { TbClipboardList } from "react-icons/tb";
import { FaUserGear } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues } from "../../Types/globalVariablesTypes";
import CloseModules from "../../utils/CloseModules";
import { useAuth } from "../../Context/AuthProvider";
import useLogout from "../../Hooks/useLogOut";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  let { state } = useAuth();
  let navigate = useNavigate();
  let moduleRef = useRef<null | HTMLDivElement>(null);

  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { cartItems, setRefetchCreatorData } = contextValues as iGlobalValues;

  const handleCloseNav = () => {
    setIsOpen(false);
  };
  CloseModules({ module_ref: moduleRef, ft_close_module: handleCloseNav });

  const goToAccountSettings = () => {
    navigate("/account-settings");
  };

  const handleShowProfile = () => {
    setRefetchCreatorData(true);
    navigate(`/${state?.creator_username}`);
  };

  return (
    <section className='appSection'>
      <div className='wishNav'>
        <img
          src={Logo}
          alt='wishlistLogo'
          className='wishlistLogo'
          onClick={() => navigate("/")}
        />
        <div className='iconsDiv'>
          <div className='userDiv' onClick={() => navigate("/cart")}>
            {cartItems.cart.length > 0 ||
            (cartItems.surpriseGift && cartItems.surpriseGift.length > 0) ? (
              <p className='wishItems'>{cartItems.cartTotalQuantity}</p>
            ) : null}
            <FiShoppingCart
              className='wishIcon _creator_header_icons'
              style={{ fontSize: "1.2rem" }}
            />
          </div>
          <div
            className='itemsIcon'
            onClick={() => {
              navigate(`/edit-profile/${state?.creator_username}`);
            }}>
            <TbClipboardList className='wishIcon _creator_header_icons' />
            <span className='iconText'>Wishlist</span>
          </div>
          <div ref={moduleRef}>
            <div
              className='itemsIcon'
              onClick={() => setIsOpen((prev) => !prev)}>
              <FaUserGear className='wishIcon _creator_header_icons' />
              <span className='iconText'>Account</span>
              <RiArrowDropDownLine className='wishIcon _creator_header_icons' />
            </div>
            <ul
              className={
                isOpen ? `openSettings accountDropDown` : `accountDropDown`
              }>
              <li onClick={goToAccountSettings}>
                <p>Account Settings</p>
              </li>
              <li onClick={handleShowProfile}>View Your Profile</li>
              <li onClick={useLogout()}>Logout</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
