import React from "react";
import "./Register.css";

import { FcGoogle } from "react-icons/fc";
import { FaSquareXTwitter, FaApple } from "react-icons/fa6";
// import UserImg from "../../Assets/LogInImg.png";
import UserImg from './UserImg'
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <section className='signup'>
      {/* <img src={UserImg} alt='' className='loginImg' /> */}
      <UserImg />
      <div className='FormsDiv'>
        <div className='loginTitle'>
          <h3>Hello!</h3>
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
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
