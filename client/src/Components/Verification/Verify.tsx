import React from "react";
import "./verify.css";

import EmailImg from "../../Assets/completed.png";

const Verify = (): JSX.Element => {
  return (
    <div>
      <div className='verify-container'>
        <img src={EmailImg} alt='Email sent' className='emailImg' />
        <h1>Please verify your email.</h1>
        <p>You're almost there! We have sent a verification email to email.</p>
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
        <button className='verifyBtn'>Resend Verification Email</button>
      </div>
    </div>
  );
};

export default Verify;
