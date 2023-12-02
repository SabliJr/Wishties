import React, { useState, useEffect, useRef } from "react";
import "./Register.css";

import { FcGoogle } from "react-icons/fc";
import { FaSquareXTwitter, FaApple } from "react-icons/fa6";
import UserImg from "./UserImg";
import { useNavigate } from "react-router-dom";
import { onRegistration } from "../../API/authApi";
import { registrationInfo } from "../../Types/creatorSocialLinksTypes";

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,15}$/;

const SignUp = () => {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [registerValues, setRegisterValues] = useState<registrationInfo>({
    creatorName: "",
    email: "",
    pwd: "",
  });
  const navigate = useNavigate();

  const onValueChange = (e: any, field: string) => {
    setRegisterValues({
      ...registerValues,
      [field]: e.target.value || "",
    });
  };

  //TO check if the user has agreed to the terms
  const handleCheckboxChange = () => {
    setAgreeTerms((prevValue) => !prevValue);
  };

  // to check if the email is valid
  const validateEmail = (email: string) => {
    return EMAIL_REGEX.test(email);
  };

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(registerValues.pwd));
    setValidMatch(registerValues.pwd === matchPwd);
  }, [registerValues.pwd, matchPwd]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Handling submit........");

    const v1 = EMAIL_REGEX.test(registerValues.email);
    const v2 = PWD_REGEX.test(registerValues.pwd);
    if (!v1 || !v2) {
      setErrMsg("Please fill in all fields.");
      return;
    }

    if (!agreeTerms) {
      setErrMsg("Please agree to the terms.");
      return;
    }

    if (!validateEmail(registerValues.email)) {
      setErrMsg("Please enter a valid email address.");
      return;
    }

    if (!validPwd) {
      setErrMsg(
        "Password must be 8-15 characters long and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."
      );
      return;
    }

    if (!validMatch) {
      setErrMsg("Passwords do not match.");
      return;
    }

    if (validMatch && validPwd && agreeTerms) {
      setErrMsg("");
    }

    try {
      const res = await onRegistration(registerValues);
      console.log("res", res);
    } catch (err: any) {
      console.error(err.res);
    }
  };

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
            <form className='forms' onSubmit={(e) => handleSubmit(e)}>
              <input
                type='text'
                placeholder='name'
                value={registerValues.creatorName}
                onChange={(e) => onValueChange(e, "creatorName")}
                autoComplete='off'
                required
              />
              <input
                type='email'
                placeholder='Email'
                autoComplete='off'
                value={registerValues.email}
                onChange={(e) => onValueChange(e, "email")}
                required
              />
              <input
                type='password'
                placeholder='Password'
                onChange={(e) => onValueChange(e, "pwd")}
                value={registerValues.pwd}
                autoComplete='off'
                required
              />
              <div>
                <input
                  type='password'
                  placeholder='Confirm Password'
                  value={matchPwd}
                  onChange={(e) => setMatchPwd(e.target.value)}
                  autoComplete='off'
                  required
                />
                <div className='agree'>
                  <input
                    type='checkbox'
                    id='agreeCheck'
                    checked={agreeTerms}
                    onChange={handleCheckboxChange}
                    required
                  />
                  <p className='agreeText'>
                    I agree to the{" "}
                    <span onClick={() => navigate("/wishlist")}>
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span onClick={() => navigate("")}>Privacy Policy.</span>
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
