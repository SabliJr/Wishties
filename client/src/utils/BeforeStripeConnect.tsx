import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Skeleton from "./Skeleton";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const BeforeStripeConnect = () => {
  let navigate = useNavigate();

  useEffect(() => {
    let user_info = localStorage.getItem("user_info");
    const parsedRole = JSON.parse(user_info as string);

    if (!user_info && !parsedRole?.creator_id) {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <Skeleton>
      <button>
        <span>
          <IoIosArrowBack />
        </span>{" "}
        Back To Wishties
      </button>
      <p>
        Attention to our adult/NSFW content creators: You are on your to a
        third-party site, Stripe.com, where you will input your confidential
        payment details. Do not put any external business links to your Stripe
        account. Your business URL on Stripe has been preset to wishties.com.
        Please avoid altering this link. Stripe permits adult content creators
        to utilize Wishties for gift processing in accordance with our terms of
        service. If Stripe ever tries to deactivate your account, don't hesitate
        to contact us. We can assist you in maintaining it. Your communication
        with us can also help prevent account termination for other users and
        enhance the Wishties experience for all. We appreciate your
        collaboration.
      </p>
      <input type='checkbox' />
      <button>
        Go To Stripe{" "}
        <span>
          <IoIosArrowForward />
        </span>
      </button>
    </Skeleton>
  );
};

export default BeforeStripeConnect;
