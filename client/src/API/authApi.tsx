import axios from "axios";
// import { API_URL } from "../config";
// import { EMAIL_REGEX, PWD_REGEX } from "../utils";
import { registrationInfo, loginInfo } from "../Types/creatorSocialLinksTypes";

const LOGIN_URL = "http://localhost:8000/api/login";
const LOGOUT_URL = "http://localhost:8000/api/logout";
const USER_URL = "http://localhost:8000/api/creators";
const WISHLIST_URL = "http://localhost:8000/api/wishlist";

const SERER_URL = "http://localhost:8000/api";

const onRegistration = async (registrationData: registrationInfo) => {
  return await axios.post(`${SERER_URL}/register`, registrationData);
};

const requestVerificationAgain = async (email: string) => {
  return await axios.post(`${SERER_URL}/request-verification-again`, { email });
};

const onLogin = async (loginData: loginInfo) => {
  return await axios.post(`${LOGIN_URL}`, loginData);
};

const onLogout = async () => {
  return await axios.post(`${LOGOUT_URL}`);
};

const onGetUser = async () => {
  return await axios.get(`${USER_URL}`);
};

const onGetWishlist = async () => {
  return await axios.get(`${WISHLIST_URL}`);
};

export {
  onGetWishlist,
  onGetUser,
  onLogout,
  onLogin,
  onRegistration,
  requestVerificationAgain,
};
