import React from "react";
import "./Register.css";

import { FcGoogle } from "react-icons/fc";
import { FaSquareXTwitter, FaApple } from "react-icons/fa6";
import UserImg from "./UserImg";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <section className='signSection'>
      <UserImg />
      <div className='signup'>
        <div className='FormsDiv'>
          <h3 className='signUpTitle'>Hello!</h3>
          <div className='loginTitle'>
            <p>Sign up today and get you wishes fulfilled.</p>
          </div>
          <div>
            <form className='forms'>
              <input type='email' placeholder='Email' />
              <input type='password' placeholder='Password' />
              <div>
                <input type='password' placeholder='Confirm Password' />
                <div className='agree'>
                  <input type='checkbox' id='agreeCheck' />
                  <p className='agreeText'>
                    I agree to the <span>Terms of Service</span> and{" "}
                    <span>Privacy Policy.</span>
                  </p>
                </div>
              </div>
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
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
