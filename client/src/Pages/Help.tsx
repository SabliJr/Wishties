import React from "react";
import Skeleton from "../utils/Skeleton";
import "./Pages.css";

const Help = () => {
  return (
    <Skeleton>
      <div className='_help_container'>
        <h3>Advice and answers from Wishties Team.</h3>
        <p>
          As of now, we are still in the process of building our FAQ page. We
          would be thrilled to collaborate with you to make this page as helpful
          as possible.
          <br />
          <br />
          We are here to help you with any questions you may have. Please feel
          free to contact us.{" "}
          <span className='_help_span'>info.wishties@gmail.com</span>
        </p>
      </div>
    </Skeleton>
  );
};

export default Help;
