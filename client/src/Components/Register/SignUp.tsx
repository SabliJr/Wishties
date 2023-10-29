import React from "react";
import "./Register.css";

import { FcGoogle } from "react-icons/fc";
import { FaSquareXTwitter, FaApple } from "react-icons/fa6";
import UserImg from "./UserImg";
// import { useNavigate } from "react-router-dom";

const SignUp = () => {
  // const navigate = useNavigate();

  return (
    <section className='signSection'>
      <h3 className='signUpTitle'>Hello!</h3>
      <p className='signUpCopy'>
        Thanks for dropping by! Our app is in development, but the excitement is
        building. Sign up now to be among the first to get{" "}
        <span>early access</span> or join the <span>waiting list</span>, and
        we'll keep you in the loop.
      </p>
      <div className='signup'>
        <UserImg />
        <div className='FormsDiv'>
          <div className='loginTitle'>
            <p>Sign up today and get you wishes fulfilled.</p>
          </div>
          <div>
            <form className='forms'>
              <input type='email' placeholder='Email' />
              <input type='password' placeholder='Password' />
              <input type='password' placeholder='Confirm Password' />
              <button type='submit'>Sign Up</button>
            </form>
            <h3 className='or'>Or SignUp with</h3>
            <div className='iconsDiv'>
              <div>
                <FcGoogle className='loginIcons' />
              </div>
              <div>
                <FaSquareXTwitter className='loginIcons' />
              </div>
              <div>
                <FaApple className='loginIcons' />
              </div>
            </div>
          </div>
          <p className='logText'>
            If you already have an account, keep an eye on your inbox.{" "}
            <span>We'll be emailing you soon.</span>
            {/* <span onClick={() => navigate("/login")}>Login</span> */}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
