import React from "react";

import Skeleton from "../utils/Skeleton";

import { FaXTwitter } from "react-icons/fa6";
import { RiArrowRightSLine } from "react-icons/ri";

const AccountSettings = () => {
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const response = await onGetUserInfos(
  //         user_local_info?.creator_id as string
  //       );
  //       console.log(response);
  //       if (response.status === 200) {
  //         setUser_display_info(response.data);
  //       }
  //     } catch (error) {
  //       if (error) {
  //         setError(
  //           "There were a problem getting your infos, please try again."
  //         );
  //       }
  //     }
  //   })();
  // }, [navigate]);

  return (
    <Skeleton>
      <div className='_account_settings_container'>
        <h1 className='_account_setting_title'>Account Settings</h1>
        <div className='_setting_items'>
          <p>
            Email <span className='_coming_soon'>coming soon</span>{" "}
            <RiArrowRightSLine className='_setting_arrow' />
          </p>
          <p>
            Rest password <span className='_coming_soon'>coming soon</span>{" "}
            <RiArrowRightSLine className='_setting_arrow' />
          </p>
          <p>
            Display currency <span className='_coming_soon'>coming soon</span>{" "}
            <RiArrowRightSLine className='_setting_arrow' />
          </p>
          <p>
            Surprise gift setting{" "}
            <span className='_coming_soon'>coming soon</span>{" "}
            <RiArrowRightSLine className='_setting_arrow' />
          </p>
          <p>
            Auto Tweet <span className='_coming_soon'>coming soon</span>{" "}
            <span className='_auto_tweet'>
              <FaXTwitter /> Set up autoTweet
            </span>
          </p>
          <p>
            Display my account on discovery page{" "}
            <span className='_coming_soon'>coming soon</span>{" "}
            <RiArrowRightSLine className='_setting_arrow' />
          </p>
          <p>
            Delete account <span className='_coming_soon'>coming soon</span>{" "}
            <RiArrowRightSLine className='_setting_arrow' />
          </p>
        </div>
      </div>
    </Skeleton>
  );
};

export default AccountSettings;
