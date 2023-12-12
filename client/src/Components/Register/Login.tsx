import React, { useState, useContext } from "react";
import "./Register.css";

import { FcGoogle } from "react-icons/fc";
import { FaSquareXTwitter } from "react-icons/fa6";
import UserImg from "./UserImg";
import { useNavigate } from "react-router-dom";
import { onLogin } from "../../API/authApi";
import Loader from "../../Loader";
import { iGlobalValues } from "../../Types/creatorSocialLinksTypes";
import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";

const Login = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [logInData, setLogInData] = useState({
    email: "",
    pwd: "",
  });
  const [emptyFields, setEmptyFields] = useState("");

  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { setUserEmail, setServerErrMsg } = contextValues as iGlobalValues;
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!logInData.email || !logInData.pwd) {
      setEmptyFields("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const res = await onLogin(logInData);

      // If a user email is verified and logged in is successfully
      if (res.data.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/wishlist");
      }

      setIsLoading(false);
    } catch (error: any) {
      if (error.response) {
        // Check if the error has a response and response data
        if (error.response.status === 403) {
          let theError = error.response.data.message;

          // If there are errors, update the state with the error message
          setServerErrMsg(theError);
          setUserEmail && setUserEmail(logInData.email);
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

        console.log(error);
        setIsLoading(false);
      }
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
                  value={logInData.email}
                  onChange={(e) => {
                    setLogInData({ ...logInData, email: e.target.value });
                    setEmptyFields("");
                    setServerErrMsg("");
                  }}
                />

                <span>
                  <input
                    type='password'
                    placeholder='Password'
                    value={logInData.pwd}
                    onChange={(e) => {
                      setLogInData({ ...logInData, pwd: e.target.value });
                      setEmptyFields("");
                      setServerErrMsg("");
                    }}
                  />

                  <p
                    style={{
                      marginTop: "1rem",
                      color: "#d4145ad3",
                    }}>
                    Forget password?
                  </p>
                </span>

                {/* Password error */}
                {emptyFields && <p id='pwdErrMsg'>{emptyFields}</p>}

                {/* Server error */}
                {isError && <p className='serverErrMsg'>{isError}</p>}

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

export default Login;
