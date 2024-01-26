import React, { useState, useContext } from "react";
import "./Register.css";

import { FcGoogle } from "react-icons/fc";
import { FaSquareXTwitter } from "react-icons/fa6";
import UserImg from "./UserImg";
import { useNavigate } from "react-router-dom";
import { onLogin } from "../../API/authApi";
import Loader from "../../utils/Loader";
import { iGlobalValues } from "../../Types/globalVariablesTypes";
import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { useAuth } from "../../Context/authCntextProvider";

const Login = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [emptyFields, setEmptyFields] = useState("");
  const [isError, setIsError] = useState("");
  const [logInData, setLogInData] = useState({
    email: "",
    pwd: "",
  });

  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { setUserEmail, setServerErrMsg } = contextValues as iGlobalValues;
  const { setAuth } = useAuth();
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
        const accessToken = response?.data?.accessToken;
        let user_role = response?.data?.role;
        const { creator_id, username } = response?.data.user;
        setAuth({ creator_id, username, accessToken });
        setLogInData({ email: "", pwd: "" });

        let user_info = {
          userId: creator_id as string,
          username: username as string,
          role: user_role,
        };
        localStorage.setItem("user_info", JSON.stringify(user_info));

        navigate(`/edit-profile/${response.data.user.username}`);
      }
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
      }
    } finally {
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
                  value={logInData.email}
                  onChange={(e) => {
                    setLogInData({ ...logInData, email: e.target.value });
                    setEmptyFields("");
                    setIsError("");
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
                      setIsError("");
                    }}
                    autoComplete='on'
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
