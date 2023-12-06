import React from "react";

import LoaderImg from "./Assets/VZvw.gif";

const Loader = () => {
  return (
    <div className='TheLoader'>
      <img src={LoaderImg} alt='LoaderImage' className='spinnerImg' />
    </div>
  );
};

export default Loader;
