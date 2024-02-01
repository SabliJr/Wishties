import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./utils.css";

import Skeleton from "./Skeleton";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const BeforeStripeConnect = () => {
  const [username, setUsername] = React.useState("");
  const [isAgree, setIsAgree] = React.useState(false);
  const [isStripeConnected, setIsStripeConnected] = React.useState(false); // [1]
  const [error, setError] = React.useState(""); // [3]
  let navigate = useNavigate();

  useEffect(() => {
    let user_info = localStorage.getItem("user_info");
    const parsedRole = JSON.parse(user_info as string);
    setUsername(parsedRole?.username);

    if (!user_info && !parsedRole?.creator_id) {
      navigate("/login", { replace: true });
    }
  }, []);

  const goToStripe = () => {
    if (!isAgree) {
      setError("Please agree to this term to proceed.");
      return;
    }
    window.open(
      "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_Hr4TlXeQ4wzUZ3ZU8o0q5hJQr9KXsYQK&scope=read_write",
      "_blank"
    );
  };

  return (
    <Skeleton>
      <div className='_stripe_notice_container'>
        <button
          className='_back_to_app_btn'
          onClick={() => navigate(`/wishlist/${username}`)}>
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
