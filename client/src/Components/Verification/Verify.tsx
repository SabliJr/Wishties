import React, { useState } from "react";
import "./verify.css";

import { useNavigate } from "react-router-dom";
import { onRequestVerificationAgain } from "../../API/authApi";
import EmailImg from "../../Assets/completed.png";
// import { useUserInfoCOntext } from "../../Context/UserProfileContextProvider";

type tProps = {
  userEmail: string;
};

const Verify = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // const { userEmail } = useUserInfoCOntext();
  // console.log(userEmail);

  const handleResendVerification = async () => {
    // navigate("/loader");
    try {
      setIsLoading(true);
      const res = await onRequestVerificationAgain("userEmail");
      console.log(res);
      navigate("/verify");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className='verify-container'>
        <img src={EmailImg} alt='Email sent' className='emailImg' />
        <h1>Please verify your email.</h1>
        <p>
          You're almost there! We have sent a verification email to "userEmail".
        </p>
        <br />
        <br />
        <p>
          Just click the link in the email to complete your signUp. If you don't
          see it, you may need to{" "}
          <span className='checkSpam'>check your spam</span> folder.
        </p>
        <br />
        <br />
        <p>Still can't find the email !? No problem.</p>
        <button className='verifyBtn' onClick={handleResendVerification}>
          Resend Verification Email
        </button>
      </div>
    </>
  );
};

export default Verify;
