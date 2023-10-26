import React from "react";
import "./Login.css";

import { FcGoogle } from "react-icons/fc";
import { FaSquareXTwitter, FaApple } from "react-icons/fa6";
import LogInImg from "../../Assets/LogInImg.png";

const Index = () => {
  return (
    <section className='login'>
      <img src={LogInImg} alt='' className='loginImg' />
      <div>
        <div className='loginTitle'>
          <h3>Welcome back!</h3>
          <p>
            Don't have an account? <span>Sign up</span>
          </p>
        </div>
        <div>
          <form className='forms'>
            <input type='email' placeholder='Email' />
            <span>
              <input type='password' placeholder='Password' />
              <p>Forget password?</p>
            </span>
            <button type='submit'>Login</button>
          </form>
          <h3 className='or'>Or login with</h3>
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
      </div>
    </section>
  );
};

export default Index;
