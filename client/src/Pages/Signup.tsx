import React from "react";

import SignUp from "../Components/Register/SignUp";
import Skeleton from "../utils/Skeleton";

const SignUpPage = () => {
  return (
    <Skeleton>
      <div className='signUpPage'>
        <SignUp />
      </div>
    </Skeleton>
  );
};

export default SignUpPage;
