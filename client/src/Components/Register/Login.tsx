import React, { useState } from "react";
import "./Register.css";

import { FcGoogle } from "react-icons/fc";
import { FaSquareXTwitter } from "react-icons/fa6";
import UserImg from "./UserImg";
import { useNavigate } from "react-router-dom";
import { onLogin } from "../../API/authApi";
import Loader from "../../Loader";

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#-&_$%()<>^*~]).{8,15}$/;

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [logInData, setLogInData] = useState({
    email: "",
    pwd: "",
  });
  const [errMsg, setErrMsg] = useState({
    emailErr: "",
    pwdErr: "",
  });
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!EMAIL_REGEX.test(logInData.email)) {
      setErrMsg({
        ...errMsg,
        emailErr: "Please enter a valid email",
      });
      return;
    }

    if (!PWD_REGEX.test(logInData.pwd)) {
      setErrMsg({
        ...errMsg,
        pwdErr: "Password must be 8-15 characters long",
      });
      return;
    }

    try {
      setIsLoading(true);
      const res = await onLogin(logInData);
      console.log(res);
      setIsLoading(false);
      // navigate("/home");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
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
              <form className='forms' onSubmit={(e) => handleLogin(e)}>
                <input
                  type='email'
                  placeholder='Email'
                  onChange={(e) =>
                    setLogInData({ ...logInData, email: e.target.value })
                  }
                />

                {/* Email error */}
                {errMsg.emailErr && (
                  <p className='emailErrMsg'>{errMsg.emailErr}</p>
                )}

                <span>
                  <input
                    type='password'
                    placeholder='Password'
                    onChange={(e) =>
                      setLogInData({ ...logInData, pwd: e.target.value })
                    }
                  />
                  <p
                    style={{
                      marginTop: "1rem",
                    }}>
                    Forget password?
                  </p>
                </span>

                {/* Password error */}
                {errMsg.pwdErr && <p id='pwdErrMsg'>{errMsg.pwdErr}</p>}

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
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
