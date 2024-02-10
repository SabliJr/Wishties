import React from "react";
import { useNavigate } from "react-router-dom";
import "./utils.css";

import Skeleton from "./Skeleton";
import { useAuth } from "../Context/AuthProvider";
import { onPaymentSetup } from "../API/authApi";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Loader from "./Loader";

const BeforeStripeConnect = () => {
  const [isAgree, setIsAgree] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(""); // [3]
  let navigate = useNavigate();
  let { state } = useAuth();

  const goToStripe = async () => {
    if (!isAgree) {
      setError("Please agree to this term to proceed.");
      return;
    }
    setIsLoading(true);

    try {
      const res = await onPaymentSetup();
      setIsAgree(false);

      window.location.href = res.data.URL;
    } catch (error) {
      console.log(error);
      alert("An error occurred. Please try again.");
      // throw error; // Ensure that the error is propagated to the calling function
      setIsLoading(false);
      setIsAgree(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Skeleton>
      <div className='_stripe_notice_container'>
        <button
          className='_back_to_app_btn'
          onClick={() => navigate(`/edit-profile/${state?.creator_username}`)}>
          <IoIosArrowBack />
          Back To Wishties
        </button>
        <p className='_notice_txt'>
          Attention to our adult/NSFW content creators: You are on your to a
          third-party site, Stripe.com, where you will input your confidential
          payment details. Do not put any external business links to your Stripe
          account. Your business URL on Stripe has been preset to wishties.com.
          <span className='_notice_txt_spans'>
            {" "}
            Please avoid altering this link
          </span>
          . Stripe permits adult content creators to utilize Wishties for gift
          processing in accordance with our terms of service.
          <br />
          <br />
          If Stripe ever tries to deactivate your account, don't hesitate to
          contact us. We can assist you in maintaining it. Your communication
          with us can also help prevent account termination for other users and
          enhance the Wishties experience for all. We appreciate your
          collaboration.
        </p>
        <span className='_notice_agree_checkbox'>
          <input
            type='checkbox'
            onClick={() => {
              setIsAgree(!isAgree);
              setError("");
            }}
          />
          I will only use Wishties to receive gifts, tips and donations. I will
          not sell services or goods on my wishlist.
        </span>
        {error && <p className='_error_txt'>{error}</p>}
        <button className='_go_to_stripe_btn' onClick={goToStripe}>
          Go To Stripe
          <IoIosArrowForward />
        </button>
      </div>
    </Skeleton>
  );
};

export default BeforeStripeConnect;
