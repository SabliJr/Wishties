import React, { useState, useRef, useContext, useEffect } from "react";
import "./wishHeader.css";

import Logo from "../../Assets/xLogo.png";
import { useAuth } from "../../Context/authCntextProvider";
import { onLogout } from "../../API/authApi";

//Icons
import { TbClipboardList } from "react-icons/tb";
import { FaUserGear } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues } from "../../Types/globalVariablesTypes";
import { iLocalUser } from "../../Types/creatorStuffTypes";
import CloseModules from "../../utils/CloseModules";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user_info, setUser_info] = useState<iLocalUser | null>({
    creator_id: "",
    username: "",
    role: "",
  });
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  let moduleRef = useRef<null | HTMLDivElement>(null);

  const handleCloseNav = () => {
    setIsOpen(false);
  };
  CloseModules({ module_ref: moduleRef, ft_close_module: handleCloseNav });

  useEffect(() => {
    let role = localStorage.getItem("user_info");
    if (role) setUser_info(JSON.parse(role));
    else setUser_info(null);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await onLogout();
      if (res.status === 200) {
        setAuth({});
        navigate(`/wishlist/${user_info?.username}`); // Display the creator's wishlist as a guest
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        alert("SORRY, WE COULDN'T FIND THAT PAGE");
      } else if (error.response.status === 500) {
        alert("Something went wrong");
      } else {
        alert("Something went wrong");
      }
    }
  };

  const showProfile = () => {
    navigate(`/wishlist/${user_info?.username}`);
  };

  const goToAccountSettings = () => {
    navigate("/profile/account-settings");
  };

  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { cartItems } = contextValues as iGlobalValues;

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
          <p className='fqa' onClick={() => navigate("/how-it-works")}>
            FAQ
          </p>
          <div className='userDiv' onClick={() => navigate("/cart")}>
            <p className='wishItems'>{cartItems.cartTotalQuantity}</p>
            <FiShoppingCart
              className='wishIcon'
              style={{ fontSize: "1.2rem" }}
            />
          </div>
          <div
            className='itemsIcon'
            onClick={() => navigate(`/edit-profile/${user_info?.username}`)}>
            <TbClipboardList className='wishIcon' />
            <span className='iconText'>Wishlist</span>
          </div>
          <div ref={moduleRef}>
            <div
              className='itemsIcon'
              onClick={() => setIsOpen((prev) => !prev)}>
              <FaUserGear className='wishIcon' />
              <span className='iconText'>Account</span>
              <RiArrowDropDownLine className='wishIcon' />
            </div>
            <ul
              className={
                isOpen ? `openSettings accountDropDown` : `accountDropDown`
              }>
              <li onClick={goToAccountSettings}>
                <p>Account Settings</p>
              </li>
              <li onClick={showProfile}>
                <p>View your profile</p>
              </li>
              <li onClick={handleLogout}>
                <p>Logout</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
