import React from "react";
import "./Pages.css";

import NotFoundSvg from "../utils/404_svg";
import Skeleton from "../utils/Skeleton";

const NotFound = () => {
  return (
    <Skeleton>
      <div className='_404_page_container'>
        <div className='_404_svg'>
          <NotFoundSvg />
        </div>
        <h2 className='_not_found_title'>Page Not Found!</h2>
      </div>
    </Skeleton>
  );
};

export default NotFound;
