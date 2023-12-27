import React from "react";

const FormatMoney = ({ price }: { price: number }) => {
  return (
    <>
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD", // Change this
      }).format(price as unknown as number)}
    </>
  );
};

export default FormatMoney;
