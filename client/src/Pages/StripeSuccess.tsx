import React, { useEffect } from "react";

const StripeSuccess = () => {
  useEffect(() => {
    localStorage.removeItem("cart");
    localStorage.removeItem("cartTotalQuantity");
    localStorage.removeItem("cartTotalAmount");
  }, []);

  return (
    <div>
      <h1>Thank you for your support!</h1>
    </div>
  );
};

export default StripeSuccess;
