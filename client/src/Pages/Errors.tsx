import React from "react";
import "./Pages.css";

const Errors = ({ error }: { error: string }) => {
  return (
    <div className='_error_page'>
      <h1>Error! 😧</h1>
      <p>{error}</p>
    </div>
  );
};

export default Errors;
