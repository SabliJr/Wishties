import React, { useState, useContext } from "react";
import "./Register.css";

import UserImg from "./UserImg";

import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { onLogin } from "../../API/authApi";

import Loader from "../../utils/Loader";

import { iCreatorDataProvider } from "../../Types/creatorStuffTypes";
import { iGlobalValues } from "../../Types/globalVariablesTypes";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { useCreatorData } from "../../Context/CreatorDataProvider";
import { useAuth } from "../../Context/AuthProvider";

const Login = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [emptyFields, setEmptyFields] = useState("");
  const [isError, setIsError] = useState("");
  const [logInData, setLogInData] = useState({
    email: "",
    pwd: "",
  });

  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { setServerErrMsg } = contextValues as iGlobalValues;
  const { setRefreshCreatorData } = useCreatorData() as iCreatorDataProvider;
  const { dispatch, verificationEmail, setVerificationEmail } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!logInData.email || !logInData.pwd) {
      setEmptyFields("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await onLogin(logInData);

      // If a user email is verified and logged in is successful
      if (response.status === 202) {
        // Save the user id and username in the context
        const { creator_id, username } = response?.data.user;
        setLogInData({ email: "", pwd: "" });

        dispatch({
          type: "LOGIN",
          payload: {
            accessToken: response.data.token,
            user_id: creator_id,
            creator_username: username,
          },
        });
        setRefreshCreatorData(true);
        navigate(`/edit-profile/${response.data.user.username}`);
      }
    } catch (error: any) {
      if (error.response) {
        // Check if the error has a response and response data
        if (error.response.status === 403) {
          let theError = error.response.data.message;

          // If there are errors, update the state with the error message
          setServerErrMsg(theError);
          verificationEmail && setVerificationEmail(logInData?.email as string);
          navigate("/verify");
        } else if (
          error.response &&
          error.response.data &&
          error.response.data.errors &&
          error.response.status === 500 &&
          error.response.data.errors.length > 0
        ) {
          setIsError(error.response.data.errors[0].msg);
        } else if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          setIsError(error.response.data.errors[0].msg);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPWD = async () => {
    console.log("Reset password");
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
                  className='forms_inputs'
                  placeholder='Email'
                  value={logInData.email}
                  onChange={(e) => {
                    setLogInData({ ...logInData, email: e.target.value });
                    setEmptyFields("");
                    setIsError("");
                  }}
                />

                <div>
                  <span
                    className='forms_inputs'
                    style={{ outline: isFocused ? "1px solid #1547d2" : "" }}>
                    <input
                      className='pwd_forms_input'
                      type={showPwd ? "text" : "password"}
                      placeholder='Password'
                      value={logInData.pwd}
                      onChange={(e) => {
                        setLogInData({ ...logInData, pwd: e.target.value });
                        setEmptyFields("");
                        setIsError("");
                      }}
                      autoComplete='on'
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
                  </span>
                  <p className='forgetPwdLink' onClick={handleResetPWD}>
                    Forget password?
                  </p>
                </div>

                {/* Password error */}
                {emptyFields && <p id='pwdErrMsg'>{emptyFields}</p>}

                {/* Server error */}
                {isError && <p className='serverErrMsg'>{isError}</p>}

                <button type='submit'>Login</button>
              </form>
              {/* <div className='or_div'> */}
              <h3 className='or'>Or</h3>
              {/* </div> */}
              <div className='Login_icon_div'>
                <FcGoogle className='loginIcons' />
                <p>Login With Google</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
