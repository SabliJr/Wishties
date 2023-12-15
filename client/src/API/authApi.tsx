import axios from "axios";
import { registrationInfo, loginInfo } from "../Types/creatorSocialLinksTypes";

const SERVER_URL = "http://localhost:8000/api";

const onRegistration = async (registrationData: registrationInfo) => {
  return await axios.post(
    `${SERVER_URL}/register`,
    JSON.stringify(registrationData),
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

const onRequestVerificationAgain = async (email: string) => {
  return await axios.post(
    `${SERVER_URL}/request-verification-again`,
    JSON.stringify({ email }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

const onLogin = async (loginData: loginInfo) => {
  return await axios.post(`${SERVER_URL}/login`, JSON.stringify(loginData), {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const onRefreshToken = async () => {
  return await axios.get(`${SERVER_URL}/refresh-token`, {
    withCredentials: true,
  });
};

export const axiosPrivate = axios.create({
  baseURL: SERVER_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const onLogout = async () => {
  return await axios.post(`${SERVER_URL}/logout`, {
    withCredentials: true,
  });
};

const onGetUser = async () => {
  return await axios.get(`${SERVER_URL}`);
};

const onGetWishlist = async () => {
  return await axios.get(`${SERVER_URL}`);
};

export {
  onGetWishlist,
  onGetUser,
  onLogout,
  onLogin,
  onRegistration,
  onRequestVerificationAgain,
  onRefreshToken,
};
