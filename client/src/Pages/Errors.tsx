import React from "react";
import "./Pages.css";

import Skeleton from "../utils/Skeleton";

const Errors = ({ error }: { error: string }) => {
  return (
    <Skeleton>
      <div className='_error_page'>
        <h1>Error! 😧</h1>
        <p>{error}</p>
      </div>
    </Skeleton>
  );
};

export default Errors;
