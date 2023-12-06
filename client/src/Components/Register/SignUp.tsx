import React, { useState, useEffect, useContext } from "react";
import "./Register.css";

import { FcGoogle } from "react-icons/fc";
import { FaSquareXTwitter } from "react-icons/fa6";
import UserImg from "./UserImg";
import { useNavigate } from "react-router-dom";
import { onRegistration } from "../../API/authApi";
import {
  registrationInfo,
  iErrorMsgs,
  iGlobalValues,
} from "../../Types/creatorSocialLinksTypes";
import Loader from "../../Assets/VZvw.gif";
import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const USER_NAME_REGEX = /^[a-zA-Z0-9_-]{3,}$/;
const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#-&_$%()<>^*~]).{8,15}$/;

const SignUp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const [errMsg, setErrMsg] = useState<iErrorMsgs>({
    fieldsEmpty: "",
    termsNotChecked: "",
    validPwdErr: "",
    validMatchErr: "",
    validEmailErr: "",
    emailExistsErr: "",
    theNameErr: "",
  });
  const [registerValues, setRegisterValues] = useState<registrationInfo>({
    creator_name: "",
    email: "",
    password: "",
  });

  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { setUserEmail } = contextValues as iGlobalValues;
  const navigate = useNavigate();

  const onValueChange = (e: any, field: string) => {
    setRegisterValues({
      ...registerValues,
      [field]: e.target.value || "",
    });
  };

  // to check if the email is valid
  const validateEmail = (email: string) => {
    return EMAIL_REGEX.test(email);
  };

  useEffect(() => {
    const isPwdValid = PWD_REGEX.test(registerValues.password);
    setValidPwd(isPwdValid);
    setValidMatch(registerValues.password === matchPwd);
  }, [registerValues.password, matchPwd]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      !registerValues.email ||
      !registerValues.password ||
      !registerValues.creator_name
    ) {
      setErrMsg((prevValue) => ({
        ...prevValue,
        fieldsEmpty: "Please fill in all fields.",
      }));
      return;
    }

    if (!agreeTerms) {
      setErrMsg((prevValue) => ({
        ...prevValue,
        termsNotChecked: "Please agree to the terms of service to proceed!.",
      }));
      return;
    }

    if (!validateEmail(registerValues.email)) {
      setErrMsg((prevValue) => ({
        ...prevValue,
        validEmailErr: "Please enter a valid email address.",
      }));
      return;
    }

    if (!validMatch) {
      setErrMsg((prevValue) => ({
        ...prevValue,
        validMatchErr: "Passwords do not match.",
      }));
      return;
    }

    if (!validPwd) {
      setErrMsg((prevValue) => ({
        ...prevValue,
        validPwdErr:
          "Password must be 8-15 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character.",
      }));
      return;
    }

    if (!USER_NAME_REGEX.test(registerValues.creator_name)) {
      setErrMsg((prevValue) => ({
        ...prevValue,
        theNameErr:
          "Username must be 3-15 characters long and can contain only letters, numbers, underscores and hyphens.",
      }));
      return;
    }

    try {
      setIsLoading(true);
      const res = await onRegistration(registerValues);
      if (res.status === 201) {
        navigate("/verify");
        setIsLoading(false);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        setErrMsg((prevValue) => ({
          ...prevValue,
          emailExistsErr: err.response.data.errors[0].msg,
        }));
      } else {
        // Handle other errors
        setErrMsg((prevValue) => ({
          ...prevValue,
          fieldsEmpty: "Something went wrong. Please try again later.",
        }));
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className='TheLoader'>
          <img src={Loader} alt='spinner' className='spinnerImg' />
        </div>
      )}
      <section className='signSection'>
        <UserImg />
        <div className='signup'>
          <div className='FormsDiv'>
            <h3 className='signUpTitle'>Hello!</h3>
            <div className='loginTitle'>
              <p>Sign up today and get you wishes fulfilled.</p>
            </div>
            <div>
              <form className='forms' onSubmit={handleSubmit}>
                <input
                  type='text'
                  placeholder='name'
                  value={registerValues.creator_name}
                  onChange={(e) => {
                    onValueChange(e, "creator_name");
                    setErrMsg((prevValue) => ({
                      ...prevValue,
                      fieldsEmpty: "",
                      theNameErr: "",
                    }));
                  }}
                  autoComplete='off'
                />
                  
                  {/* To check if the name is valid */}
                {errMsg.theNameErr ? (
                  <p className='nameErrMsg'>{errMsg.theNameErr}</p>
                ) : null}

                <input
                  type='email'
                  placeholder='Email'
                  autoComplete='off'
                  value={registerValues.email}
                  onChange={(e) => {
                    onValueChange(e, "email");
                    setUserEmail(registerValues.email);
                    setErrMsg((prevValue) => ({
                      ...prevValue,
                      validEmailErr: "",
                      emailExistsErr: "",
                    }));
                  }}
                />

                {/* To check if the email is valid */}
                {errMsg.validEmailErr ? (
                  <p className='emailErrMsg'>{errMsg.validEmailErr}</p>
                ) : null}

                {/* To check if the email already exists */}
                {errMsg.emailExistsErr ? (
                  <p className='emailErrMsg'>{errMsg.emailExistsErr}</p>
                ) : null}

                <input
                  type='password'
                  placeholder='Password'
                  onChange={(e) => {
                    onValueChange(e, "password");
                    setErrMsg((prevValue) => ({
                      ...prevValue,
                      validPwdErr: "",
                    }));
                  }}
                  value={registerValues.password}
                  autoComplete='off'
                />
                {errMsg.validPwdErr ? (
                  <p id='pwdErrMsg'>{errMsg.validPwdErr}</p>
                ) : null}
                <div>
                  <input
                    type='password'
                    placeholder='Confirm Password'
                    value={matchPwd}
                    onChange={(e) => {
                      setMatchPwd(e.target.value);
                      setErrMsg((prevValue) => ({
                        ...prevValue,
                        validMatchErr: "",
                      }));
                    }}
                    autoComplete='off'
                  />
                  {errMsg.validMatchErr ? (
                    <p className='matchErrMsg'>{errMsg.validMatchErr}</p>
                  ) : null}
                  <div className='agree'>
                    <input
                      type='checkbox'
                      id='agreeCheck'
                      checked={agreeTerms}
                      onChange={() => {
                        setAgreeTerms(!agreeTerms);
                        setErrMsg((prevValue) => ({
                          ...prevValue,
                          termsNotChecked: "",
                        }));
                      }}
                    />

                    <label htmlFor='agreeCheck' className='agreeText'>
                      I agree to the{" "}
                      <span onClick={() => navigate("")}>Terms of Service</span>{" "}
                      and{" "}
                      <span onClick={() => navigate("")}>Privacy Policy</span>.
                    </label>
                  </div>
                </div>

                {/* To check if the terms are agreed */}
                {errMsg.termsNotChecked ? (
                  <p className='termsErrMsg'>{errMsg.termsNotChecked}</p>
                ) : null}

                {/* To check if all fields are filled */}
                {errMsg.fieldsEmpty ? (
                  <p className='emptyFieldsErrMsg'>{errMsg.fieldsEmpty}</p>
                ) : null}
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
              </div>
            </div>
            <p className='logText'>
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
