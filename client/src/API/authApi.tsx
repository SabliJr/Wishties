import axios from "axios";
// import { API_URL } from "../config";
// import { EMAIL_REGEX, PWD_REGEX } from "../utils";
import { registrationInfo, loginInfo } from "../Types/creatorSocialLinksTypes";

const REGISTER_URL = "http://localhost:8000/api/register";
const LOGIN_URL = "http://localhost:8000/api/login";
const LOGOUT_URL = "http://localhost:8000/api/logout";
const USER_URL = "http://localhost:8000/api/user";
const WISHLIST_URL = "http://localhost:8000/api/wishlist";

const onRegistration = async (registrationData: registrationInfo) => {
  return await axios.post(`${REGISTER_URL}`, registrationData);
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

export { onGetWishlist, onGetUser, onLogout, onLogin, onRegistration };
