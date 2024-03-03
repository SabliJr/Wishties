import React, { useEffect, useState, useRef } from "react";
import "./verify.css";
import "../../App.css";

import { onVerifyEmail } from "../../API/authApi";

import Navbar from "../../Components/TheHeader/index";
import Footer from "../../Components/Footer/index";
import Loader from "../../utils/Loader";

import MailChecked from "../../Assets/check-mail.png";
import ErrorImg from "../../Assets/error-message.png";

import { useAuth } from "../../Context/AuthProvider";

const VerifyEmail = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(true);

  const { dispatch } = useAuth();

  // Setting a dynamic timeout (e.g., 90 seconds)
  const timeoutDuration = 5 * 1000; // 90 seconds in milliseconds
  const remainingTimeRef = useRef(timeoutDuration / 1000);

  useEffect(() => {
    (async () => {
      const token = window.location.pathname.split("/")[2];

      try {
        setIsLoaded(true);
        const res = await onVerifyEmail(token);

        if (res.status === 202) {
          // Save the user id and username in the context
          const { creator_id, username } = res?.data.user;

          dispatch({
            type: "LOGIN",
            payload: {
              accessToken: res?.data?.accessToken,
              user_id: creator_id,
              creator_username: username,
            },
          });

          // Set verification success state
          setVerificationSuccess(true);

          const countdownInterval = setInterval(() => {
            remainingTimeRef.current -= 1;

            if (remainingTimeRef.current <= 0) {
              clearInterval(countdownInterval);
              window.location.href = res?.data?.redirectURL;
            }
          }, 500);
        }
      } catch (error: any) {
        if (error.response.status === 500) {
          setErrorMessage("Something went wrong. Please try again.");
        } else if (error.response.status === 404) {
          setErrorMessage("The token is invalid. Please try again.");
        } else {
          setErrorMessage(`Something went wrong. Please try again.`);
        }
      } finally {
        setIsLoaded(false);
      }
    })();
  }, []);

  return (
    <>
      {isLoaded ? (
        <Loader />
      ) : errorMessage ? (
        <main className='verificationPage'>
          <Navbar />
          <div className='emailVerifiedSectionErr'>
            <img src={ErrorImg} alt='mail-checked' className='checkedMail' />
            <h3 className='verifyTitleErr'>There was an Error!</h3>
            <p className='verifyMsgErr'>{errorMessage}</p>
          </div>
          <Footer />
        </main>
      ) : verificationSuccess ? (
        <main className='verificationPage'>
          <Navbar />
          <div className='emailVerifiedSection'>
            <img src={MailChecked} alt='mail-checked' className='checkedMail' />
            <h3 className='verifyTitle'>Success!</h3>
            <p className='verifyMsg'>
              Your email has been successfully verified.
            </p>
          </div>
          <Footer />
        </main>
      ) : null}
    </>
  );
};

export default VerifyEmail;
