import React from "react";
import HashLoader from "react-spinners/HashLoader";

const Loader = () => {
  return (
    <div>
      <HashLoader
        size={70}
        style={{
          color: "rgba(214, 131, 54, 1)",
        }}
      />
    </div>
  );
};

export default Loader;
