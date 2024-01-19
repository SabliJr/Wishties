import React from "react";

import Navbar from "../Components/TheHeader/index";
import Footer from "../Components/Footer/index";
import CartPage from "../Container/Cart/Cart";

const Cart = () => {
  return (
    <>
      <Navbar />
      <CartPage />
      <Footer />
    </>
  );
};

export default Cart;
