import React from "react";
import "../../Pages/Pages.css";

import NotFoundSvg from "../../utils/404_svg";

const NotFound = () => {
  return (
    <div>
      <div className='_404_page_container'>
        <div className='_404_svg'>
          <NotFoundSvg />
        </div>
        <h2 className='_not_found_title'>Not Found!</h2>
      </div>
    </div>
  );
};

export default NotFound;
