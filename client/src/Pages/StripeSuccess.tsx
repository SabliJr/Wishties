import React, { useEffect } from "react";
import Skeleton from "../utils/Skeleton";

import { useNavigate, useLocation } from "react-router-dom";

import "./Pages.css";

const StripeSuccess = () => {
  let navigate = useNavigate();
  let location = useLocation();

  const cleanup = () => {
    localStorage.removeItem("cart_items");
    localStorage.removeItem("cart_total_quantity");
    localStorage.removeItem("cart_total_amount");
  };

  useEffect(() => {
    cleanup();
    navigate(location.pathname);
  }, []);

  return (
    <Skeleton>
      <div className='_success_page'>
        <h1 className='_success_page_title'>Thank you for your support!</h1>
        <button className='_success_page_btn' onClick={() => navigate("/")}>
          Go Back Home
        </button>
      </div>
    </Skeleton>
  );
};

export default StripeSuccess;
