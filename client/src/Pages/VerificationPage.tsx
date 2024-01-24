import React from "react";

import Verify from "../Components/Verification/Verify";
import Skeleton from "../utils/Skeleton";

const VerificationPage = () => {
  return (
    <Skeleton>
      <div className='verificationPage'>
        <Verify />
      </div>
    </Skeleton>
  );
};

export default VerificationPage;
