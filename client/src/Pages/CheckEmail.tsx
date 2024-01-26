import React, { useContext } from "react";
import { GlobalValuesContext } from "../Context/globalValuesContextProvider";
import { iGlobalValues } from "../Types/globalVariablesTypes";
import "../App.css";

import Skeleton from "../utils/Skeleton";

const CheckEmail = () => {
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { reverificationSuccess } = contextValues as iGlobalValues;

  return (
    <div className='checkYourEmailPage'>
      <Skeleton>
        <div className='msgContainer'>
          <div>
            <h1>Your Email 😊</h1>
            <p>{reverificationSuccess}</p>
          </div>
        </div>
      </Skeleton>
    </div>
  );
};

export default CheckEmail;
