import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Skeleton from "../utils/Skeleton";

const AccountSettings = () => {
  let navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // const response = await onGetUserInfos(
        //   user_local_info?.creator_id as string
        // );
        // console.log(response);
        // if (response.status === 200) {
        //   setUser_display_info(response.data);
        // }
      } catch (error) {
        if (error) {
          // setError(
          //   "There were a problem getting your infos, please try again."
          // );
        }
      }
    })();
  }, [navigate]);

  return (
    <Skeleton>
      <div style={{ minHeight: "65vh" }}>
        <h1>Account Settings</h1>
      </div>
    </Skeleton>
  );
};

export default AccountSettings;
