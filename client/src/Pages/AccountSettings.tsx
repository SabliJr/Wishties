import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onGetUserInfos } from "../API/authApi";

import { iLocalUser } from "../Types/creatorStuffTypes";

import Skeleton from "../utils/Skeleton";

const AccountSettings = () => {
  const [user_local_info, setUser_Local_info] =
    React.useState<iLocalUser | null>(null);
  const [user_display_info, setUser_display_info] = React.useState<
    string[] | null
  >(null);
  const [error, setError] = React.useState("");
  let navigate = useNavigate();

  useEffect(() => {
    let user_info = localStorage.getItem("user_info");
    const parsedRole = JSON.parse(user_info as string);
    setUser_Local_info(parsedRole);

    if (!user_info && !parsedRole.creator_id) {
      navigate("/login", { replace: true });
    } else setUser_Local_info(null);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await onGetUserInfos(
          user_local_info?.creator_id as string
        );
        console.log(response);
        if (response.status === 200) {
          setUser_display_info(response.data);
        }
      } catch (error) {
        if (error) {
          setError(
            "There were a problem getting your infos, please try again."
          );
        }
      }
    })();
  }, [user_local_info, navigate]);

  return (
    <Skeleton>
      <div style={{ minHeight: "65vh" }}>
        <h1>Account Settings</h1>
      </div>
    </Skeleton>
  );
};

export default AccountSettings;
