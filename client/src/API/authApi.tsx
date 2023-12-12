import axios from "axios";
import { registrationInfo, loginInfo } from "../Types/creatorSocialLinksTypes";

const SERER_URL = "http://localhost:8000/api";

const onRegistration = async (registrationData: registrationInfo) => {
  return await axios.post(`${SERER_URL}/register`, registrationData);
};

const onRequestVerificationAgain = async (email: string) => {
  return await axios.post(`${SERER_URL}/request-verification-again`, { email });
};

const onLogin = async (loginData: loginInfo) => {
  return await axios.post(`${SERER_URL}/login`, loginData);
};

const onLogout = async () => {
  return await axios.post(`${SERER_URL}`);
};

const onGetUser = async () => {
  return await axios.get(`${SERER_URL}`);
};

const onGetWishlist = async () => {
  return await axios.get(`${SERER_URL}`);
};

export {
  onGetWishlist,
  onGetUser,
  onLogout,
  onLogin,
  onRegistration,
  onRequestVerificationAgain,
};
