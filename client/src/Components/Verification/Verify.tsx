import React, { useState, useContext, useEffect } from "react";
import "./verify.css";

import { useNavigate } from "react-router-dom";
import { onRequestVerificationAgain } from "../../API/authApi";
import EmailImg from "../../Assets/completed.png";
import { iGlobalValues } from "../../Types/globalVariablesTypes";
import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { useAuth } from "../../Context/AuthProvider";

const Verify = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const navigate = useNavigate();

  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { setReverificationSuccess, serverErrMsg } =
    contextValues as iGlobalValues;
  const { verificationEmail, setVerificationEmail } = useAuth();

  useEffect(() => {
    if (!verificationEmail) {
      navigate("/signUp");
    }
    verificationEmail && setVerificationEmail(verificationEmail as string);
  }, [verificationEmail, navigate, setVerificationEmail]);

  // Setting a dynamic timeout (e.g., 90 seconds)
  const timeoutDuration = 5 * 1000; // 90 seconds in milliseconds
  let remainingTime = timeoutDuration / 1000;

  const handleResendVerification = async () => {
    try {
      setIsLoading(true);
      const res = await onRequestVerificationAgain(verificationEmail as string);
      if (res.data.success === true) {
        navigate("/check-email");
      }
      setReverificationSuccess && setReverificationSuccess(res.data.message);
    } catch (err: any) {
      if (err.response.status === 404) {
        setIsError(err.response.data.message);

        // Display countdown timer
        const countdownInterval = setInterval(() => {
          remainingTime -= 1;
          if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            navigate("/signUp");
          }
        }, 500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='verify-container'>
        <img src={EmailImg} alt='Email sent' className='emailImg' />
        <h1>Please verify your email.</h1>
        {serverErrMsg ? (
          <>
            <p className='verifyError'>{serverErrMsg}</p>

            <br />
            <br />
            <p>
              Just click the link to complete your verification. If you don't
              see it, you may need to{" "}
              <span className='checkSpam'>check your spam</span> folder.
            </p>
          </>
        ) : (
          <>
            <p>
              You're almost there! We have sent a verification email to{" "}
              <span className='userEmailSpan'>{verificationEmail}</span>!
            </p>

            <br />
            <br />
            <p>
              Just click the link in the email to complete your signUp. If you
              don't see it, you may need to{" "}
              <span className='checkSpam'>check your spam</span> folder.
            </p>
          </>
        )}

        <br />
        <br />
        <p id='certify'>Still can't find the email !? No problem.</p>
        <button
          className='verifyBtn'
          onClick={handleResendVerification}
          disabled={isLoading}>
          Resend Verification Email
        </button>
        <br />
        {isError && remainingTime && <p className='verifyError'>{isError}</p>}
      </div>
    </>
  );
};

export default Verify;
