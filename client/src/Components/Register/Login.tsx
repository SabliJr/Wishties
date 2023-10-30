import React from "react";
import "./Register.css";

import { FcGoogle } from "react-icons/fc";
import { FaSquareXTwitter, FaApple } from "react-icons/fa6";
import UserImg from "./UserImg";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <section className='signSection'>
      <UserImg />
      <div className='login'>
        <div className='FormsDiv'>
          <div className='loginTitle'>
            <h3>Welcome back!</h3>
            <p>
              Don't have an account?{" "}
              <span onClick={() => navigate("/signup")}>Sign up</span>
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
      </div>
    </section>
  );
};

export default Index;
