import React, { useState } from "react";
import "./Register.css";

import UserImg from "./UserImg";
import { useNavigate } from "react-router-dom";
import { onRegistration, onSignUpWithGoogle } from "../../API/authApi";
import { registrationInfo } from "../../Types/creatorStuffTypes";
import { iErrorMsgs } from "../../Types/ErrorsTypes";
import { useAuth } from "../../Context/AuthProvider";
import Loader from "../../utils/Loader";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const USER_NAME_REGEX = /^[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*$/;
const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#-&_$%()<>^*~]).{8,20}$/;

const SignUp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [gLoginLoading, setGLoginLoading] = useState(false);

  const [errMsg, setErrMsg] = useState<iErrorMsgs>({
    fieldsEmpty: "",
    termsNotChecked: "",
    validPwdErr: "",
    validEmailErr: "",
    emailExistsErr: "",
    theNameErr: "",
  });
  const [registerValues, setRegisterValues] = useState<registrationInfo>({
    creator_name: "",
    email: "",
    password: "",
  });

  const { setVerificationEmail, dispatch } = useAuth();
  const navigate = useNavigate();

  const signIn = useGoogleLogin({
    onSuccess: (tokenResponse: any) => handleCredentialResponse(tokenResponse),
    ux_mode: "popup",
    select_account: false,
    scope: "profile email openid",
    flow: "auth-code",
  }) as any;

  const handleCredentialResponse = async (response: any) => {
    setGLoginLoading(true);

    try {
      const gVerifyCode = response.code; // Access the ID token directly from the response object

      const res = await onSignUpWithGoogle(gVerifyCode);
      if (res?.status === 201 || res?.status === 202) {
        dispatch({
          type: "LOGIN",
          payload: {
            accessToken: res?.data?.token,
            user_id: res?.data?.user?.creator_id,
            creator_username: res?.data?.user?.username,
          },
        });
        navigate(`/edit-profile/${res?.data?.user?.username}`);
      }
    } catch (error: any) {
      if (error.response) {
        alert(error?.response?.data?.error);
      }
    } finally {
      setGLoginLoading(false);
    }
  };

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

    if (!PWD_REGEX.test(registerValues.password)) {
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
      }
      setVerificationEmail(registerValues.email);
    } catch (err: any) {
      if (err.response && err.response?.status === 409) {
        setErrMsg((prevValue) => ({
          ...prevValue,
          emailExistsErr: err.response?.data.errors[0].msg,
        }));
      } else if (err.response && err.response?.status === 500) {
        setErrMsg((prevValue) => ({
          ...prevValue,
          fieldsEmpty: err.response?.data?.error[0].msg,
        }));
      } else {
        // Handle other errors
        setErrMsg((prevValue) => ({
          ...prevValue,
          fieldsEmpty: "Something went wrong. Please try again later.",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (gLoginLoading) {
    return <Loader />;
  }

  return (
    <>
      {isLoading && <Loader />}
      <section className='signSection'>
        <UserImg />
        <div className='signup'>
          <div className='FormsDiv'>
            <div className='_signUp_text'>
              <h3 className='signUpTitle'>Hello!</h3>
              <p className='loginTitle'>
                Sign up today and get you wishes fulfilled.
              </p>
            </div>
            <div>
              <div className='SignUp_icon_div' onClick={() => signIn()}>
                <FcGoogle className='loginIcons' />
                <p>Sign Up With google</p>
              </div>
              <h3 className='or'>Or </h3>
              <form className='forms' onSubmit={handleSubmit}>
                <input
                  type='text'
                  className='forms_inputs'
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
                  className='forms_inputs'
                  placeholder='Email'
                  autoComplete='off'
                  value={registerValues.email}
                  onChange={(e) => {
                    onValueChange(e, "email");
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
                <div
                  className='pwdDiv'
                  style={{ outline: isFocused ? "1px solid #1547d2" : "" }}>
                  <input
                    type={showPwd ? "text" : "password"}
                    className='pwd_forms_input'
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
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                  <span
                    className='pwdEye'
                    onClick={() => {
                      setShowPwd(!showPwd);
                    }}>
                    {showPwd ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                {errMsg.validPwdErr ? (
                  <p id='pwdErrMsg'>{errMsg.validPwdErr}</p>
                ) : null}
                <div>
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
                      <span onClick={() => navigate("/terms-of-service")}>
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span onClick={() => navigate("/privacy-policy")}>
                        Privacy Policy
                      </span>
                      .
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
